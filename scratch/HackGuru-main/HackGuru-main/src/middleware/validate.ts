import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ResponseUtil } from '../utils/apiResponse';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return ResponseUtil.error(res, 'Validation Error', 400, err.errors);
      }
      next(err);
    }
  };
};
