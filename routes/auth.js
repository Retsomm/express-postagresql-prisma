import express from 'express';
import validate from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';
import { registerController, loginController } from '../controllers/authController.js';

const router = express.Router();
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: 註冊新帳號
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: 小明 }
 *               email: { type: string, example: ming@example.com }
 *               password: { type: string, example: password123, minLength: 8 }
 *     responses:
 *       201:
 *         description: 註冊成功
 *       409:
 *         description: email 已被註冊過
 */
router.post('/register', validate(registerSchema), registerController);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: 登入取得 JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: ming@example.com }
 *               password: { type: string, example: password123 }
 *     responses:
 *       200:
 *         description: 登入成功，回傳 token
 *       401:
 *         description: email 或密碼錯誤
 */
router.post('/login', validate(loginSchema), loginController);

export default router;
