import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt';
import { ResponseUtil } from '../utils/apiResponse';
import { AdapterFactory } from '../adapters/adapterFactory';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseUtil.error(res, 'Authentication token missing or invalid format', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = JwtUtil.verifyToken(token);

    // If studentId not present in token, attempt lookup via AdapterFactory
    if (!decoded.studentId) {
      const student = await AdapterFactory.getAdapter().findStudentByUserId(decoded.userId);
      if (student) {
        decoded.studentId = student.id;
      }
    }

    (req as any).user = decoded;
    next();
  } catch (err: any) {
    return ResponseUtil.error(res, 'Invalid or expired token', 401, err.message);
  }
};

export const authenticateJwt = authMiddleware;
