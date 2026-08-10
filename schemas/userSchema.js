import {z} from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1,'姓名不能為空').max(50, '姓名不能超過50個字'),
  email: z.string().email('email 格式不正確'),
});

export const updateUserSchema = createUserSchema.partial();