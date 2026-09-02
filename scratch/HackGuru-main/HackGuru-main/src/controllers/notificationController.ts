import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';
import { ResponseUtil } from '../utils/apiResponse';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const studentId = (req as any).user.studentId;
      const notifications = await this.notificationService.getStudentNotifications(studentId);
      return ResponseUtil.success(res, notifications, 'Student notifications fetched');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 500);
    }
  };

  public markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const studentId = (req as any).user.studentId;
      const notificationId = req.params.id;

      const updated = await this.notificationService.markAsRead(notificationId, studentId);
      if (!updated) {
        return ResponseUtil.error(res, 'Notification not found', 404);
      }
      return ResponseUtil.success(res, null, 'Notification marked as read');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 400);
    }
  };
}
