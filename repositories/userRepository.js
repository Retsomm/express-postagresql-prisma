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

export const createUser = ({ name, email }) => {
  return prisma.user.create({ data: { name, email } });
};

export const updateUser = (id, data) => {
  return prisma.user.update({ where: { id }, data });
};

export const deleteUser = (id) => {
  return prisma.user.delete({ where: { id } });
};
