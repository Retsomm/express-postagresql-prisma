import express from 'express';
import validate from '../middlewares/validate.js';
import { updateUserSchema } from '../schemas/userSchema.js';
import {
  getUsersController,
  getUserController,
  updateUserController,
  deleteUserController,
} from '../controllers/userController.js';

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
router.get('/', getUsersController);
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
router.get('/:id', getUserController);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: 更新使用者
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 小明
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ming@example.com
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
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 資料驗證失敗
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 找不到使用者
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id', validate(updateUserSchema), updateUserController);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: 刪除使用者（連同刪除其底下的文章）
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: 刪除成功，無回傳內容
 *       404:
 *         description: 找不到使用者
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteUserController);

export default router;
