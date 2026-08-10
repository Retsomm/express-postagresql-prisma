import prisma from '../lib/prisma.js';

export const findManyTags = () => {
  return prisma.tag.findMany({ include: { posts: true } });
};

export const createTag = ({ name }) => {
  return prisma.tag.create({ data: { name } });
};
