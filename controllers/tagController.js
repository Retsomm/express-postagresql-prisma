import * as tagService from '../services/tagService.js';
import { successResponse } from '../utils/response.js';
import catchAsync from '../utils/catchAsync.js';
import parseId from '../utils/parseId.js';

export const getTagsController = catchAsync(async (req, res, next) => {
  const tags = await tagService.getTags();

  successResponse(res, 200, tags);
});

export const createTagController = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const newTag = await tagService.createNewTag({ name });

  successResponse(res, 201, newTag);
});

export const updateTagController = catchAsync(async (req, res, next) => {
  const tagId = parseId(req.params.id, 'tagId');

  const updatedTag = await tagService.updateExistingTag({ tagId, data: req.body });

  successResponse(res, 200, updatedTag);
});

export const deleteTagController = catchAsync(async (req, res, next) => {
  const tagId = parseId(req.params.id, 'tagId');

  await tagService.deleteExistingTag({ tagId });

  res.status(204).send();
});
