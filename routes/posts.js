import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import validate from '../middlewares/validate.js';
import { createPostSchema } from '../schemas/postSchema.js';
import {
  getPostsController,
  createPostController,
  updatePostController,
  deletePostController,
} from '../controllers/postController.js';

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
 *         description: 頁碼，預設 1
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *         description: 每頁筆數，預設 10
 *     responses:
 *       200:
 *         description: 成功取得文章列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 */
router.get('/', getPostsController);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       401:
 *         description: 未登入
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: tagIds 中有不存在的標籤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticate, validate(createPostSchema), createPostController);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       401:
 *         description: 未登入
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 不是作者本人，沒有權限
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 找不到文章
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id', authenticate, updatePostController);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 不是作者本人，沒有權限
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 找不到文章
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticate, deletePostController);

export default router;
