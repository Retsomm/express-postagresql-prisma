import * as postService from '../services/postService.js';
import { successResponse } from '../utils/response.js';
import catchAsync from '../utils/catchAsync.js';

export const getPostsController = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

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
  const postId = Number(req.params.id);

  const updatedPost = await postService.updateExistingPost({
    postId,
    userId: req.userId,
    data: req.body,
  });

  successResponse(res, 200, updatedPost);
});

export const deletePostController = catchAsync(async (req, res, next) => {
  const postId = Number(req.params.id);

  await postService.deleteExistingPost({ postId, userId: req.userId });

  res.status(204).send();
});