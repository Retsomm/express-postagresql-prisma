import express from 'express';
import {
  getTagsController,
  createTagController,
  updateTagController,
  deleteTagController,
} from '../controllers/tagController.js';

const router = express.Router();
/**
 * @openapi
 * /tags:
 *   get:
 *     summary: 取得標籤列表
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: 成功取得標籤列表
 */
router.get('/', getTagsController);
/**
 * @openapi
 * /tags:
 *   post:
 *     summary: 新增標籤
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: 技術 }
 *     responses:
 *       201:
 *         description: 新增成功
 */
router.post('/', createTagController);
/**
 * @openapi
 * /tags/{id}:
 *   patch:
 *     summary: 更新標籤
 *     tags: [Tags]
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
 *               name: { type: string, example: 技術 }
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
 *                   $ref: '#/components/schemas/Tag'
 *       404:
 *         description: 找不到標籤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id', updateTagController);
/**
 * @openapi
 * /tags/{id}:
 *   delete:
 *     summary: 刪除標籤
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: 刪除成功，無回傳內容
 *       404:
 *         description: 找不到標籤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteTagController);

export default router;
