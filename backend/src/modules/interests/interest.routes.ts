import { Router } from 'express';
import { InterestController } from './interest.controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import {
  createInterestSchema,
  updateInterestStatusSchema,
  getInterestsSchema
} from './interest.schema.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create adoption application
router.post('/', validate(createInterestSchema), InterestController.createInterest);

// Get current user's applications
router.get('/my', validate(getInterestsSchema), InterestController.getMyInterests);

// Get interests for a specific post (for post owners)
router.get('/post/:postId', validate(getInterestsSchema), InterestController.getInterestsForPost);

// Update interest status (for post owners)
router.patch('/:interestId/status', validate(updateInterestStatusSchema), InterestController.updateInterestStatus);

// Withdraw application (for applicants)
router.delete('/:interestId', InterestController.withdrawInterest);

// Admin routes
router.get('/admin/stats', authorize('admin'), InterestController.getInterestStats);

export default router;
