import { z } from 'zod';

export const createPostSchema = z.object({
    title: z.string().min(1, '標題不能為空').max(200, '標題不能超過 200 個字'),
    content: z.string().optional(),
    tagIds: z.array(z.number().int()).optional(),
});

export const updatePostSchema = createPostSchema.partial();