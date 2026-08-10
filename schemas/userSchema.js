import {z} from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1,'姓名不能為空').max(50, '姓名不能超過50個字'),
  email: z.string().email('email 格式不正確'),
}).partial();