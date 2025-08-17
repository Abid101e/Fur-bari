import { Router } from 'express';
import { UserController } from './user.controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { updateUserSchema, changePasswordSchema, getUsersSchema } from './user.schema.js';

const router = Router();

// Protected routes - require authentication
router.use(authenticate);

// Current user routes
router.get('/me', UserController.getMe);
router.patch('/me', validate(updateUserSchema), UserController.updateMe);
router.delete('/me', UserController.deleteMe);
router.patch('/me/password', validate(changePasswordSchema), UserController.changePassword);

// Public user profile routes
router.get('/:userId', UserController.getUserById);

// Admin only routes
router.get('/', authorize('admin'), validate(getUsersSchema), UserController.getUsers);
router.delete('/:userId', UserController.deleteUser); // This allows users to delete their own account or admins to delete any
router.patch('/:userId/role', authorize('admin'), UserController.updateUserRole);
router.get('/admin/stats', authorize('admin'), UserController.getUserStats);

export default router;
