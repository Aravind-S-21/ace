import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  logger.error(`[UnhandledError] ${err.message}`, err.stack);
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  return ResponseUtil.error(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};
