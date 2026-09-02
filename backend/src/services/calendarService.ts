import { CalendarRepository } from '../repositories/calendarRepository';
import { EventRepository } from '../repositories/eventRepository';
import { InteractionRepository } from '../repositories/interactionRepository';
import { ActionType } from '../types/enums';

export class CalendarService {
  private calendarRepository: CalendarRepository;
  private eventRepository: EventRepository;
  private interactionRepository: InteractionRepository;

  constructor() {
    this.calendarRepository = new CalendarRepository();
    this.eventRepository = new EventRepository();
    this.interactionRepository = new InteractionRepository();
  }

  public async addCalendarEvent(data: {
    studentId: string | bigint;
    eventId: string | bigint;
    reminderType?: string; // REGISTRATION_DEADLINE, EVENT_START, CUSTOM
    customReminderTime?: Date | string;
  }): Promise<any> {
    const event = await this.eventRepository.findById(data.eventId);
    if (!event) {
      throw new Error(`Event with ID ${data.eventId} not found.`);
    }

    const reminderType = data.reminderType || 'REGISTRATION_DEADLINE';
    let reminderTime: Date;

    if (reminderType === 'EVENT_START') {
      reminderTime = new Date(new Date(event.startDate || event.registrationDeadline).getTime() - 24 * 60 * 60 * 1000); // 1 day before event start
    } else if (reminderType === 'CUSTOM' && data.customReminderTime) {
      reminderTime = new Date(data.customReminderTime);
    } else {
      // REGISTRATION_DEADLINE default: 24h before registration deadline
      reminderTime = new Date(new Date(event.registrationDeadline).getTime() - 24 * 60 * 60 * 1000);
    }

    const calendarEvent = await this.calendarRepository.addCalendarEvent({
      studentId: data.studentId,
      eventId: data.eventId,
      startDate: event.startDate || event.registrationDeadline,
      registrationDeadline: event.registrationDeadline,
      reminderTime,
      reminderType,
      status: 'UPCOMING',
    });

    // Also log CALENDAR_ADD interaction for recommendation feedback loop
    await this.interactionRepository.logInteraction({
      studentId: data.studentId,
      eventId: data.eventId,
      action: ActionType.CALENDAR_ADD,
      metadata: { reminderType, reminderTime: reminderTime.toISOString() },
    });

    return calendarEvent;
  }

  public async getStudentCalendar(studentId: string | bigint): Promise<any[]> {
    return this.calendarRepository.getStudentCalendarEvents(studentId);
  }

  public async removeCalendarEvent(id: string, studentId: string | bigint): Promise<boolean> {
    return this.calendarRepository.removeCalendarEvent(id, studentId);
  }
}
