import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  meta?: any;
}

export class ResponseUtil {
  public static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: any
  ): Response {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(statusCode).json(payload);
  }

  public static error(
    res: Response,
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    errorDetails?: any
  ): Response {
    const payload: ApiResponse = {
      success: false,
      message,
      error: errorDetails || null,
    };
    return res.status(statusCode).json(payload);
  }
}
