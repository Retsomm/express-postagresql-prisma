import * as postService from '../services/postService.js';
import { successResponse } from '../utils/response.js';
import catchAsync from '../utils/catchAsync.js';
import parseId from '../utils/parseId.js';
import { parsePagination } from '../utils/pagination.js';

export const getPostsController = catchAsync(async (req, res, next) => {
  const { page, limit } = parsePagination(req.query);

  const { items, meta } = await postService.getPosts({ page, limit });

  successResponse(res, 200, items, meta);
});

export const createPostController = catchAsync(async (req, res, next) => {
  const { title, content, tagIds } = req.body;

  const newPost = await postService.createNewPost({
    title,
    content,
    authorId: req.userId,
    tagIds,
  });

  successResponse(res, 201, newPost);
});

export const updatePostController = catchAsync(async (req, res, next) => {
  const postId = parseId(req.params.id, 'postId');

  const updatedPost = await postService.updateExistingPost({
    postId,
    userId: req.userId,
    data: req.body,
  });

  successResponse(res, 200, updatedPost);
});

export const deletePostController = catchAsync(async (req, res, next) => {
  const postId = parseId(req.params.id, 'postId');

  await postService.deleteExistingPost({ postId, userId: req.userId });

  res.status(204).send();
});