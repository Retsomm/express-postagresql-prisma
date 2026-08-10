import prisma from '../lib/prisma.js';
import { safeUserSelect } from '../utils/selects.js';

export const findManyUsers = ({ skip, take }) => {
  return prisma.user.findMany({
    skip,
    take,
    orderBy: { id: 'asc' },
    select: safeUserSelect,
  });
};

export const countUsers = () => {
  return prisma.user.count();
};

export const findUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { ...safeUserSelect, posts: true },
  });
};

export const updateUser = (id, data) => {
  return prisma.user.update({ where: { id }, data, select: safeUserSelect });
};

export const deleteUserWithPosts = (id) => {
  return prisma.$transaction([
    prisma.post.deleteMany({ where: { authorId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);
};
