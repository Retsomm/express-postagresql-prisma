import express from 'express';
import prisma from '../lib/prisma.js';
import createAppError from '../errors/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { successResponse } from '../utils/response.js';
import { createPostSchema, updatePostSchema } from '../schemas/postSchema.js';
import validate from '../middlewares/validate.js';
import authenticate from '../middlewares/authenticate.js';
import { safeUserSelect } from '../utils/selects.js';
import redisClient from '../lib/redis.js';

const router = express.Router();
/**
 * @openapi
 * /posts:
 *   get:
 *     summary: 取得文章列表（分頁）
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 成功取得文章列表
 */
router.get('/', catchAsync(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  // 用查詢條件組成一把獨一無二的「快取鑰匙」，不同的 page/limit 要對應不同的快取內容
  const cacheKey = `posts:page=${page}:limit=${limit}`;

  // 步驟 1：先問 Redis 有沒有現成的資料
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log('命中快取，不用查資料庫');
    return successResponse(res, 200, ...JSON.parse(cached)); // 直接把存起來的結果回傳
  }

  // 步驟 2：快取沒有，才真的去查資料庫（這段是你原本就有的邏輯）
  console.log('快取沒有，查詢資料庫');
  const [items, totalItems] = await Promise.all([
    prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
      include: { author: { select: safeUserSelect }, tags: true },
    }),
    prisma.post.count(),
  ]);

  const meta = {
    currentPage: page,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  };

  // 步驟 3：把查詢結果存進 Redis，設定 60 秒後自動過期
  await redisClient.set(cacheKey, JSON.stringify([items, meta]), { EX: 60 });

  successResponse(res, 200, items, meta);
}));
/**
 * @openapi
 * /posts:
 *   post:
 *     summary: 新增文章（需要登入）
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: 我的第一篇文章
 *               content:
 *                 type: string
 *                 example: 這是內文
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *     responses:
 *       201:
 *         description: 新增成功
 *       401:
 *         description: 未登入
 */
router.post('/', authenticate,validate(createPostSchema), catchAsync(async (req, res, next) => {
    const { title, content, tagIds } = req.body;// 注意：這裡不再從 req.body 拿 authorId

    const newPost = await prisma.post.create({
        data: { 
            title, 
            content, 
            authorId: req.userId,// 改成用 middleware 解出來的 userId，前端無法偽造
            tags: {
                connect: (tagIds || []).map((id)=>({ id})),
            },
         },
         include: { tags: true, author: true } // 順便把關聯資料一起回傳，讓前端不用再多打一次 API
    }).catch((err)=>{
        // 對外仍回統一訊息，但先把 Prisma 原始錯誤（含 code、meta.field_name 等）印出來方便除錯
        console.error('建立文章失敗，原始錯誤：', err);
        // 如果 authorId 對應不到任何真實存在的 User，Prisma 會丟出 P2003（外鍵限制錯誤）
        throw createAppError('authorId 或 tagIds 中有不存在的資料', 400);
    });
    // 新增成功後，清掉所有跟文章列表相關的快取，強迫下次查詢重新讀取資料庫
    const keys = await redisClient.keys('posts:page=*');
    if (keys.length > 0) {
        await redisClient.del(keys);
    }
    successResponse(res, 201, newPost);
}));
/**
 * @openapi
 * /posts/{id}:
 *   patch:
 *     summary: 編輯文章（僅限作者本人）
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               tagIds:
 *                 type: array
 *                 items: { type: integer }
 *     responses:
 *       200:
 *         description: 更新成功
 *       401:
 *         description: 未登入
 *       403:
 *         description: 不是作者本人，沒有權限
 *       404:
 *         description: 找不到文章
 */
router.patch('/:id', authenticate, catchAsync(async(req, res, next)=>{
    const postId = Number(req.params.id);

    // 先查出這篇文章，確認存在，順便拿到 authorId 做權限比對
    const post = await prisma.post.findUnique({ where: {id: postId}});

    if(!post){
        throw createAppError(`找不到 id 為 ${postId} 的文章`, 404);
    }

    // 關鍵權限檢查：登入的人（req.userId）必須跟這篇文章的作者（post.authorId）是同一人
    if (post.authorId !== req.userId) {
        throw createAppError('你沒有權限編輯這篇文章', 403); // 403 = Forbidden，代表「知道你是誰，但你沒權限」
    }

    const { title, content, tagIds} = req.body;

    const updatePost = await prisma.post.update({
        where: { id: postId},
        data: {
            ...(title && { title}),
            ...(content && { content}),
            ...(tagIds && { tags: { set: tagIds.map((id)=>({ id})) } })
        },
        include: { tags: true, author: true },
    });
    // 新增成功後，清掉所有跟文章列表相關的快取，強迫下次查詢重新讀取資料庫
    const keys = await redisClient.keys('posts:page=*');
    if (keys.length > 0) {
        await redisClient.del(keys);
    }
    successResponse(res, 200, updatePost);
}))
/**
 * @openapi
 * /posts/{id}:
 *   delete:
 *     summary: 刪除文章（僅限作者本人）
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: 刪除成功，無回傳內容
 *       401:
 *         description: 未登入
 *       403:
 *         description: 不是作者本人，沒有權限
 *       404:
 *         description: 找不到文章
 */
router.delete('/:id', authenticate, catchAsync(async(req, res, next)=>{
    const postId = Number(req.params.id);

    const post = await prisma.post.findUnique({ where: {id: postId} });

    if (!post) {
        throw createAppError(`找不到 id 為 ${postId} 的文章`, 404);
    }

    if (post.authorId !== req.userId) {
        throw createAppError('你沒有權限刪除這篇文章', 403);
    }

    await prisma.post.delete({ where: { id: postId}});

    // 新增成功後，清掉所有跟文章列表相關的快取，強迫下次查詢重新讀取資料庫
    const keys = await redisClient.keys('posts:page=*');
    if (keys.length > 0) {
        await redisClient.del(keys);
    }
    
    res.status(204).send();
}))

export default router;