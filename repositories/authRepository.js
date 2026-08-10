import prisma from '../lib/prisma.js';

export const findUserByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = ({ name, email, hashedPassword }) => {
  return prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
};
