import { Request, Response, NextFunction } from 'express';
import { PostService } from '../posts/post.service.js';
import { catchAsync } from '../../utils/catchAsync.js';

export class FavoriteController {
  // Toggle favorite (already implemented in PostController, but kept for module completeness)
  static toggleFavorite = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await PostService.toggleFavorite(postId, userId);
    res.status(200).json(result);
  });

  // Get user's favorite posts (already implemented in PostController)
  static getFavorites = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { page, limit } = req.query;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await PostService.getFavorites(
      userId,
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    res.status(200).json(result);
  });
}
