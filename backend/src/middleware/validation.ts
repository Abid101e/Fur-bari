import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { CustomError } from './error.js';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => {
          const path = issue.path.join('.');
          return `${path}: ${issue.message}`;
        });
        
        next(new CustomError(
          `Validation error: ${errorMessages.join(', ')}`,
          400
        ));
      } else {
        next(new CustomError('Validation error', 400));
      }
    }
  };
};
