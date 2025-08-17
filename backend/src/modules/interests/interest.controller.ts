import { Request, Response, NextFunction } from 'express';
import { InterestService } from './interest.service.js';
import { catchAsync } from '../../utils/catchAsync.js';

export class InterestController {
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

  static getInterestStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await InterestService.getInterestStats();
    res.status(200).json(result);
  });
}
