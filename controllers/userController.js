import * as userService from '../services/userService.js';
import { successResponse } from '../utils/response.js';
import catchAsync from '../utils/catchAsync.js';

export const getUsersController = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const { items, meta } = await userService.getUsers({ page, limit });

  successResponse(res, 200, items, meta);
});

export const getUserController = catchAsync(async (req, res, next) => {
  const userId = Number(req.params.id);

  const user = await userService.getUserById(userId);

  successResponse(res, 200, user);
});

export const createUserController = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;

  const newUser = await userService.createNewUser({ name, email });

  successResponse(res, 201, newUser);
});

export const updateUserController = catchAsync(async (req, res, next) => {
  const userId = Number(req.params.id);

  const updatedUser = await userService.updateExistingUser({ userId, data: req.body });

  successResponse(res, 200, updatedUser);
});

export const deleteUserController = catchAsync(async (req, res, next) => {
  const userId = Number(req.params.id);

  await userService.deleteExistingUser({ userId });

  res.status(204).send();
});
