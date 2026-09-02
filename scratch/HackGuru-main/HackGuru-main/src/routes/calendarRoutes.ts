import { Router } from 'express';
import { CalendarController } from '../controllers/calendarController';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';

const router = Router();
const calendarController = new CalendarController();

const calendarSchema = z.object({
  eventId: z.string().uuid(),
  reminderType: z.enum(['REGISTRATION_DEADLINE', 'EVENT_START', 'CUSTOM']).optional(),
  customReminderTime: z.string().optional(),
});

router.get('/', authMiddleware, calendarController.getCalendar);
router.post('/', authMiddleware, validateRequest(calendarSchema), calendarController.addCalendarEvent);
router.delete('/:id', authMiddleware, calendarController.removeCalendarEvent);

export default router;
