import * as authService from '../services/authService.js';
import { successResponse } from '../utils/response.js';
import catchAsync from '../utils/catchAsync.js';

export const registerController = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const newUser = await authService.registerNewUser({ name, email, password });

  successResponse(res, 201, newUser);
});

export const loginController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const { user, token } = await authService.loginUser({ email, password });

  successResponse(res, 200, { user, token });
});
