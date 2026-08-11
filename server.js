import 'dotenv/config';
import express from 'express';
import usersRouter from './routes/users.js';
import postsRouter from './routes/posts.js';
import tagsRouter from './routes/tags.js';
import authRouter from './routes/auth.js';
import createAppError from './errors/AppError.js';
import { swaggerSpec, swaggerHtml, swaggerDebugInfo } from './config/swagger.js';

if (!process.env.JWT_SECRET) {
  throw new Error('缺少環境變數 JWT_SECRET，請在 .env 設定後再啟動伺服器');
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req,res,next)=>{
  console.log(`收到請求：${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/tags', tagsRouter);
app.use('/auth', authRouter);
// 放在其他路由掛載的地方即可，建議放在 app.use(express.json()) 之後
app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerSpec));
// 暫時性診斷用，之後會移除
app.get('/api-docs/_debug', (req, res) => res.json(swaggerDebugInfo));
app.get('/api-docs', (req, res) => res.type('html').send(swaggerHtml));

app.use((req, res, next )=>{
  next(createAppError(`找不到路徑：${req.originalUrl}`, 404));
});

app.use((err, req, res, next)=>{
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : '伺服器發生未預期的錯誤';
  
  console.error('錯誤:', err);

  res.status(statusCode).json({
    status:'error',
    message
  });
});

app.listen(PORT, ()=>{
  console.log(`伺服器已啟動：http://localhost:${PORT}`);
});