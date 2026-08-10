import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import validate from '../middlewares/validate.js';
import { createPostSchema } from '../schemas/postSchema.js';
import {
  getPostsController,
  createPostController,
  updatePostController,
  deletePostController,
} from '../controllers/postController.js';

const router = express.Router();

router.get('/', getPostsController);
router.post('/', authenticate, validate(createPostSchema), createPostController);
router.patch('/:id', authenticate, updatePostController);
router.delete('/:id', authenticate, deletePostController);

export default router;