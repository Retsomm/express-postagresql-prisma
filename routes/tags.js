import express from 'express';
import { getTagsController, createTagController } from '../controllers/tagController.js';

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

export default router;
