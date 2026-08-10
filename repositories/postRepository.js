import prisma from '../lib/prisma.js';
import { safeUserSelect } from '../utils/selects.js';

// 每個函式都對應一個單純的資料庫操作，命名要清楚表達「做了什麼」
export const findManyPosts = ({ skip, take }) => {
  return prisma.post.findMany({
    skip,
    take,
    orderBy: { id: 'asc' },
    include: { author: { select: safeUserSelect }, tags: true },
  });
};

export const countPosts = () => {
  return prisma.post.count();
};

export const findPostById = (id) => {
  return prisma.post.findUnique({ where: { id } });
};

export const createPost = ({ title, content, authorId, tagIds }) => {
  return prisma.post.create({
    data: {
      title,
      content,
      authorId,
      tags: { connect: (tagIds || []).map((id) => ({ id })) },
    },
    include: { tags: true, author: { select: safeUserSelect } },
  });
};

export const updatePost = (id, data) => {
  return prisma.post.update({
    where: { id },
    data,
    include: { tags: true, author: { select: safeUserSelect } },
  });
};

export const deletePost = (id) => {
  return prisma.post.delete({ where: { id } });
};