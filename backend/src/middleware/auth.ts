import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../utils/jwt.js';
import { User, IUser } from '../modules/users/user.model.js';
import { CustomError } from './error.js';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new CustomError('You are not logged in! Please log in to get access.', 401);
    }

    // Verify token
    const decoded = JWTService.verifyAccessToken(token);

    // Check if user still exists
    const currentUser = await User.findById(decoded.userId);
    
    if (!currentUser) {
      throw new CustomError('The user belonging to this token no longer exists.', 401);
    }

    if (!currentUser.isActive) {
      throw new CustomError('Your account has been deactivated. Please contact support.', 401);
    }

    // Attach user to request object
    req.user = currentUser;
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError('Invalid token. Please log in again!', 401));
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new CustomError('You are not logged in! Please log in to get access.', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new CustomError('You do not have permission to perform this action', 403);
    }

    next();
  };
};

export const optionalAuth = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        // Verify token
        const decoded = JWTService.verifyAccessToken(token);

        // Check if user still exists
        const currentUser = await User.findById(decoded.userId);
        
        if (currentUser && currentUser.isActive) {
          req.user = currentUser;
        }
      } catch (error) {
        // Token is invalid, but we continue without user
        console.warn('Optional auth: Invalid token provided');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
