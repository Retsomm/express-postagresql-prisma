import validate from '../middlewares/validate.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema.js';
import express from 'express';
import createAppError from '../errors/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { successResponse } from '../utils/response.js';
import prisma from '../lib/prisma.js';
import { safeUserSelect } from '../utils/selects.js';

const router = express.Router();


/**
 * @openapi
 * /users:
 *   get:
 *     summary: 取得使用者列表（分頁）
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 頁碼，預設 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 每頁筆數，預設 10
 *     responses:
 *       200:
 *         description: 成功取得列表
 */
router.get('/', catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const [items, totalItems] = await Promise.all([
    prisma.user.findMany({
      skip: (page -1) * limit,
      take: limit,
      orderBy: { id:'asc'},
      select: safeUserSelect, // 加上這一行
    }),
    prisma.user.count(),
  ]);
  
  successResponse(res,200, items, {
    currentPage: page,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  });
}));
/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: 取得單一使用者
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 成功取得使用者
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: 找不到使用者
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id',catchAsync(async(req,res,next)=> {
  const userId = Number(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { ...safeUserSelect, posts: true }, // 如果要連同 posts 一起查，這樣
  });
  
  if(!user){
    throw createAppError(`找不到 id 為 ${userId} 的使用者`, 404);
  }
  successResponse(res,200,user);
}));
/**
 * @openapi
 * /users:
 *   post:
 *     summary: 新增使用者
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *                 example: 小明
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ming@example.com
 *     responses:
 *       201:
 *         description: 新增成功
 *       400:
 *         description: 資料驗證失敗
 */
router.post('/',validate(createUserSchema),catchAsync(async (req, res) => {
  const { name, email } = req.body;
  
  const newUser = await prisma.user.create({
    data:{name, email},
  });
  
  successResponse(res,201,newUser);
}));

router.patch('/:id',validate(updateUserSchema) ,catchAsync(async(req,res,next)=> {
  const userId = Number(req.params.id);

  const user = await prisma.user.update({
    where: { id: userId },
    data: req.body,
  }).catch(()=>{
    // Prisma 找不到資料時會丟出 P2025 錯誤，這裡攔下來轉成我們自己統一的錯誤格式
    throw createAppError(`找不到 id 為 ${userId} 的使用者`, 404);
  })
  
  successResponse(res,200,user);
}));

router.delete('/:id',catchAsync(async(req,res,next)=> {
  const userId = Number(req.params.id);

  await prisma.user.delete({
    where: { id: userId },
  }).catch(()=>{
    throw createAppError(`找不到 id 為 ${userId} 的使用者`, 404);
  });
  
  res.status(204).send();
}));

export default router;