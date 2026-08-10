import express from 'express';
import prisma from '../lib/prisma.js';
import catchAsync from '../utils/catchAsync.js';
import { successResponse } from '../utils/response.js';

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
router.get('/',catchAsync(async (req,res,next)=>{
    const tags = await prisma.tag.findMany({include: { posts: true },});
    successResponse(res, 200, tags);
}));
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
router.post('/',catchAsync(async (req,res,next)=>{
    const { name } = req.body;
    const newTag = await prisma.tag.create({
        data: { name }
    });
    successResponse(res, 201, newTag);
}));

export default router;