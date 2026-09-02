import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { ResponseUtil } from '../utils/apiResponse';

export class AuthController {
  private getService(): AuthService {
    return new AuthService();
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = await this.getService().register(req.body);
      return ResponseUtil.success(res, result, 'User registered successfully', 201);
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 400);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = await this.getService().login(req.body);
      return ResponseUtil.success(res, result, 'Login successful', 200);
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 401);
    }
  };

  public getMe = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userPayload = (req as any).user;
      const userId = userPayload.userId || userPayload.id;
      const user = await this.getService().getMe(userId);
      return ResponseUtil.success(res, user, 'Current user profile fetched successfully');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 404);
    }
  };
}
