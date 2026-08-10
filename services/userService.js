import * as userRepository from '../repositories/userRepository.js';
import createAppError from '../errors/AppError.js';

export const getUsers = async ({ page, limit }) => {
  const [items, totalItems] = await Promise.all([
    userRepository.findManyUsers({ skip: (page - 1) * limit, take: limit }),
    userRepository.countUsers(),
  ]);

  return {
    items,
    meta: { currentPage: page, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
};

export const getUserById = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw createAppError(`找不到 id 為 ${userId} 的使用者`, 404);
  }

  return user;
};

export const updateExistingUser = async ({ userId, data }) => {
  // Prisma 找不到資料時會丟出 P2025 錯誤，這裡攔下來轉成我們自己統一的錯誤格式，其他錯誤原樣往外丟
  return userRepository.updateUser(userId, data).catch((error) => {
    if (error.code === 'P2025') {
      throw createAppError(`找不到 id 為 ${userId} 的使用者`, 404);
    }
    throw error;
  });
};

export const deleteExistingUser = async ({ userId }) => {
  // 業務規則：刪除使用者時，要連同刪除他底下的文章，兩個寫入放在同一個交易裡，避免只刪成功一半
  await userRepository.deleteUserWithPosts(userId).catch((error) => {
    if (error.code === 'P2025') {
      throw createAppError(`找不到 id 為 ${userId} 的使用者`, 404);
    }
    throw error;
  });
};
