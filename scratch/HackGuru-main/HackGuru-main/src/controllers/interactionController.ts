import { Request, Response, NextFunction } from 'express';
import { InteractionService } from '../services/interactionService';
import { ResponseUtil } from '../utils/apiResponse';

export class InteractionController {
  private interactionService: InteractionService;

  constructor() {
    this.interactionService = new InteractionService();
  }

  public logInteraction = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const studentId = (req as any).user.studentId;
      const { eventId, action, metadata } = req.body;

      const logged = await this.interactionService.logInteraction({
        studentId,
        eventId,
        action,
        metadata,
      });

      return ResponseUtil.success(res, logged, 'Student interaction logged', 201);
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 400);
    }
  };
}
