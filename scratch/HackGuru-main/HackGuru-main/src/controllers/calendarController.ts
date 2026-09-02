import { Request, Response, NextFunction } from 'express';
import { CalendarService } from '../services/calendarService';
import { ResponseUtil } from '../utils/apiResponse';

export class CalendarController {
  private calendarService: CalendarService;

  constructor() {
    this.calendarService = new CalendarService();
  }

  public getCalendar = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const studentId = (req as any).user.studentId;
      const calendar = await this.calendarService.getStudentCalendar(studentId);
      return ResponseUtil.success(res, calendar, 'Student calendar events fetched');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 500);
    }
  };

  public addCalendarEvent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const studentId = (req as any).user.studentId;
      const { eventId, reminderType, customReminderTime } = req.body;

      const added = await this.calendarService.addCalendarEvent({
        studentId,
        eventId,
        reminderType,
        customReminderTime,
      });

      return ResponseUtil.success(res, added, 'Event added to student calendar', 201);
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 400);
    }
  };

  public removeCalendarEvent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const studentId = (req as any).user.studentId;
      const eventId = req.params.id;

      const removed = await this.calendarService.removeCalendarEvent(eventId, studentId);
      if (!removed) {
        return ResponseUtil.error(res, 'Calendar entry not found or unauthorized', 404);
      }
      return ResponseUtil.success(res, null, 'Calendar entry removed successfully');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 400);
    }
  };
}
