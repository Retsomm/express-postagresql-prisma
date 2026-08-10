import * as userService from '../services/userService.js';
import { successResponse } from '../utils/response.js';
import catchAsync from '../utils/catchAsync.js';
import parseId from '../utils/parseId.js';
import { parsePagination } from '../utils/pagination.js';

export const getUsersController = catchAsync(async (req, res, next) => {
  const { page, limit } = parsePagination(req.query);

  const { items, meta } = await userService.getUsers({ page, limit });

  successResponse(res, 200, items, meta);
});

export const getUserController = catchAsync(async (req, res, next) => {
  const userId = parseId(req.params.id, 'userId');

  const user = await userService.getUserById(userId);

  successResponse(res, 200, user);
});

export const updateUserController = catchAsync(async (req, res, next) => {
  const userId = parseId(req.params.id, 'userId');

  const updatedUser = await userService.updateExistingUser({ userId, data: req.body });

  successResponse(res, 200, updatedUser);
});

export const deleteUserController = catchAsync(async (req, res, next) => {
  const userId = parseId(req.params.id, 'userId');

  await userService.deleteExistingUser({ userId });

  res.status(204).send();
});
