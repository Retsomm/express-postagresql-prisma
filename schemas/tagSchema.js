import { z } from 'zod';

export const createTagSchema = z.object({
  name: z.string().min(1, '標籤名稱不能為空').max(50, '標籤名稱不能超過 50 個字'),
});

export const updateTagSchema = createTagSchema.partial();
