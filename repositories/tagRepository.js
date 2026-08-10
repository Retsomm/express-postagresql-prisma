import prisma from '../lib/prisma.js';

export const findManyTags = () => {
  return prisma.tag.findMany({ include: { posts: true } });
};

export const createTag = ({ name }) => {
  return prisma.tag.create({ data: { name } });
};

export const updateTag = (id, data) => {
  return prisma.tag.update({ where: { id }, data });
};

export const deleteTag = (id) => {
  return prisma.tag.delete({ where: { id } });
};
