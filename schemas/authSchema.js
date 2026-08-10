import {z} from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1,'姓名不能為空' ).max(50),
  email: z.string().email('Email格式不正確'),
  password: z.string().min(8, '密碼長度至少8個字元'),
});

export const loginSchema = z.object({
  email: z.string().email('Email格式不正確'),
  password: z.string().min(1,'密碼不能為空'),
});
