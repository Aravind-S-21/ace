import { NotificationRepository } from '../repositories/notificationRepository';
import { StudentRepository } from '../repositories/studentRepository';
import { EventRepository } from '../repositories/eventRepository';
import { CalendarRepository } from '../repositories/calendarRepository';
import { ScoringEngine } from '../recommendation/scoringEngine';
import { NotificationType } from '../types/enums';
import { logger } from '../utils/logger';

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private studentRepository: StudentRepository;
  private eventRepository: EventRepository;
  private calendarRepository: CalendarRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.studentRepository = new StudentRepository();
    this.eventRepository = new EventRepository();
    this.calendarRepository = new CalendarRepository();
  }

  public async getStudentNotifications(studentId: string): Promise<any[]> {
    return this.notificationRepository.getStudentNotifications(studentId);
  }

  public async markAsRead(id: string, studentId: string): Promise<boolean> {
    return this.notificationRepository.markAsRead(id, studentId);
  }

  // Category 1: Deterministic Deadline Notifications
  public async generateDeadlineNotificationsForStudent(studentId: string): Promise<number> {
    const student = await this.studentRepository.findById(studentId);
    if (!student || !student.notificationPreferences?.enableDeadlineAlerts) {
      return 0;
    }

    const calendarEvents = await this.calendarRepository.getStudentCalendarEvents(studentId);
    const existingNotifications = await this.notificationRepository.getStudentNotifications(studentId, 100);

    let generated = 0;
    const now = new Date().getTime();

    for (const calEvent of calendarEvents) {
      if (calEvent.status !== 'UPCOMING') continue;

      const deadline = new Date(calEvent.registrationDeadline).getTime();
      const diffHours = (deadline - now) / (1000 * 60 * 60);

      // Check if registration deadline is within 24-48 hours
      if (diffHours > 0 && diffHours <= 48) {
        const title = `Deadline Alert: ${calEvent.event?.title || 'Event'}`;
        const message = `Registration for "${calEvent.event?.title || 'Event'}" closes in ${Math.round(diffHours)} hours.`;

        const existing = existingNotifications.find(
          (n) => n.eventId === calEvent.eventId && n.type === NotificationType.DEADLINE
        );

        if (!existing) {
          await this.notificationRepository.createNotification({
            studentId,
            eventId: calEvent.eventId,
            title,
            message,
            type: NotificationType.DEADLINE,
          });
          generated++;
        }
      }
    }

    return generated;
  }

  // Category 2: Recommendation Notifications (Selective delivery triggered when new event ingested)
  public async triggerRecommendationNotificationsForNewEvent(eventId: string): Promise<number> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) return 0;

    const studentProfile = await this.studentRepository.findById('sample-student-id');
    if (!studentProfile) return 0;

    const scoreResult = ScoringEngine.calculateScore(studentProfile, event);
    let count = 0;

    if (scoreResult.totalScore >= 0.75) {
      const title = `New Recommended Opportunity: ${event.title}`;
      const message = `We found a high-match opportunity tailored to your profile: ${scoreResult.recommendationReason}`;

      await this.notificationRepository.createNotification({
        studentId: studentProfile.id,
        eventId: event.id,
        title,
        message,
        type: NotificationType.RECOMMENDATION,
      });

      count++;
    }

    logger.info(`[NotificationService] Checked recommendation notifications for event ${eventId}`);
    return count;
  }
}
