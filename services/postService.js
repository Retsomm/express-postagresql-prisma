import * as postRepository from '../repositories/postRepository.js';
import createAppError from '../errors/AppError.js';

export const getPosts = async ({ page, limit }) => {
  const [items, totalItems] = await Promise.all([
    postRepository.findManyPosts({ skip: (page - 1) * limit, take: limit }),
    postRepository.countPosts(),
  ]);

  return {
    items,
    meta: { currentPage: page, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
};

export const createNewPost = async ({ title, content, authorId, tagIds }) => {
  // 業務規則：檢查邏輯放在這一層，不是 Controller，也不是 Repository
  const newPost = await postRepository.createPost({ title, content, authorId, tagIds }).catch(() => {
    throw createAppError('tagIds 中有不存在的標籤', 400);
  });

  return newPost;
};

export const updateExistingPost = async ({ postId, userId, data }) => {
  const post = await postRepository.findPostById(postId);

  if (!post) {
    throw createAppError(`找不到 id 為 ${postId} 的文章`, 404);
  }

  // 業務規則：權限檢查，這是「業務邏輯」，理所當然放在 Service 層
  if (post.authorId !== userId) {
    throw createAppError('你沒有權限編輯這篇文章', 403);
  }

  const { title, content, tagIds } = data;
  return postRepository.updatePost(postId, {
    ...(title && { title }),
    ...(content && { content }),
    ...(tagIds && { tags: { set: tagIds.map((id) => ({ id })) } }),
  });
};

export const deleteExistingPost = async ({ postId, userId }) => {
  const post = await postRepository.findPostById(postId);

  if (!post) {
    throw createAppError(`找不到 id 為 ${postId} 的文章`, 404);
  }

  if (post.authorId !== userId) {
    throw createAppError('你沒有權限刪除這篇文章', 403);
  }

  await postRepository.deletePost(postId);
};