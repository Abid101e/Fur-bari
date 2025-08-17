import { Router } from 'express';
import { PostController } from './post.controller.js';
import { authenticate, authorize, optionalAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import {
  createPostSchema,
  updatePostSchema,
  updatePostStatusSchema,
  getPostsSchema,
  moderatePostSchema,
  favoritePostSchema
} from './post.schema.js';

const router = Router();

// Public routes (no authentication required)
router.get('/', optionalAuth, validate(getPostsSchema), PostController.getPosts);
router.get('/:postId', optionalAuth, PostController.getPostById);
router.get('/user/:userId', validate(getPostsSchema), PostController.getPostsByUserId);

// Protected routes (authentication required)
router.use(authenticate);

// User post management
router.post('/', validate(createPostSchema), PostController.createPost);
router.get('/my/posts', validate(getPostsSchema), PostController.getMyPosts);
router.patch('/:postId', validate(updatePostSchema), PostController.updatePost);
router.patch('/:postId/status', validate(updatePostStatusSchema), PostController.updatePostStatus);
router.delete('/:postId', PostController.deletePost);

// Favorites
router.post('/:postId/favorite', validate(favoritePostSchema), PostController.toggleFavorite);
router.get('/my/favorites', PostController.getFavorites);

// Admin routes
router.patch('/:postId/moderate', authorize('admin'), validate(moderatePostSchema), PostController.moderatePost);
router.get('/admin/stats', authorize('admin'), PostController.getPostStats);

export default router;
