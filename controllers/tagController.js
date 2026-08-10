import * as tagService from '../services/tagService.js';
import { successResponse } from '../utils/response.js';
import catchAsync from '../utils/catchAsync.js';

export const getTagsController = catchAsync(async (req, res, next) => {
  const tags = await tagService.getTags();

  successResponse(res, 200, tags);
});

export const createTagController = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const newTag = await tagService.createNewTag({ name });

  successResponse(res, 201, newTag);
});
