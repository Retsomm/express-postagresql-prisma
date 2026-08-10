import * as tagRepository from '../repositories/tagRepository.js';
import createAppError from '../errors/AppError.js';

export const getTags = () => {
  return tagRepository.findManyTags();
};

export const createNewTag = ({ name }) => {
  return tagRepository.createTag({ name });
};

export const updateExistingTag = async ({ tagId, data }) => {
  // Prisma 找不到資料時會丟出 P2025 錯誤，這裡攔下來轉成我們自己統一的錯誤格式，其他錯誤原樣往外丟
  return tagRepository.updateTag(tagId, data).catch((error) => {
    if (error.code === 'P2025') {
      throw createAppError(`找不到 id 為 ${tagId} 的標籤`, 404);
    }
    throw error;
  });
};

export const deleteExistingTag = async ({ tagId }) => {
  await tagRepository.deleteTag(tagId).catch((error) => {
    if (error.code === 'P2025') {
      throw createAppError(`找不到 id 為 ${tagId} 的標籤`, 404);
    }
    throw error;
  });
};
