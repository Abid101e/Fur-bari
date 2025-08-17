import { Request, Response, NextFunction } from 'express';
import { InterestService } from './interest.service.js';
import { catchAsync } from '../../utils/catchAsync.js';

export class InterestController {
  // Create a new adoption application
  static createInterest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await InterestService.createInterest(req.body, userId);
    res.status(201).json(result);
  });

  // Get interests for a specific post (for post owners)
  static getInterestsForPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await InterestService.getInterestsForPost(postId, userId, req.query);
    res.status(200).json(result);
  });

  // Get current user's applications
  static getMyInterests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await InterestService.getMyInterests(userId, req.query);
    res.status(200).json(result);
  });

  // Update interest status (for post owners)
  static updateInterestStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { interestId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await InterestService.updateInterestStatus(interestId, req.body, userId);
    res.status(200).json(result);
  });

  // Withdraw application (for applicants)
  static withdrawInterest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { interestId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await InterestService.withdrawInterest(interestId, userId);
    res.status(200).json(result);
  });

  // Get interest statistics (admin only)
  static getInterestStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await InterestService.getInterestStats();
    res.status(200).json(result);
  });
}
