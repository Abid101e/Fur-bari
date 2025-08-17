import { Request, Response, NextFunction } from 'express';
import { PostService } from './post.service.js';
import { catchAsync } from '../../utils/catchAsync.js';

export class PostController {
  static createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await PostService.createPost(req.body, userId);
    res.status(201).json(result);
  });

  static getPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await PostService.getPosts(req.query);
    res.status(200).json(result);
  });

  static getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await PostService.getPosts({
      ...req.query,
      ownerId: userId,
    });
    res.status(200).json(result);
  });

  static getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user?.id;

    const result = await PostService.getPostById(postId, userId);
    res.status(200).json(result);
  });

  static updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await PostService.updatePost(postId, req.body, userId);
    res.status(200).json(result);
  });

  static updatePostStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await PostService.updatePostStatus(postId, status, userId);
    res.status(200).json(result);
  });

  static deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await PostService.deletePost(postId, userId);
    res.status(200).json(result);
  });

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

  static moderatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { action, reason } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await PostService.moderatePost(postId, action, userId, reason);
    res.status(200).json(result);
  });

  static getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await PostService.getPostStats();
    res.status(200).json(result);
  });

  static getPostsByUserId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    const result = await PostService.getPosts({
      ...req.query,
      ownerId: userId,
      status: 'active',
    });
    res.status(200).json(result);
  });
}
