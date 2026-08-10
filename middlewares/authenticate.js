import jwt from 'jsonwebtoken';
import createAppError from '../errors/AppError.js';

const authenticate = (req, res, next) => {
    // 前端要把 token 放在 request header 裡，格式慣例是：Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(createAppError('請先登入才能執行這個動作', 401));
    }

    const token = authHeader.split(' ')[1];// "Bearer xxxxx" 拆開，取後半段真正的 token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // 將解碼後的使用者 ID 存到 req 物件上，方便後續中間件或路由使用
        next();
    } catch (err) {
        next(createAppError('token 無效或已過期，請重新登入', 401));
    }
};

export default authenticate;