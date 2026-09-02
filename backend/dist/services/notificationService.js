"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notificationRepository_1 = require("../repositories/notificationRepository");
const studentRepository_1 = require("../repositories/studentRepository");
const eventRepository_1 = require("../repositories/eventRepository");
const calendarRepository_1 = require("../repositories/calendarRepository");
const scoringEngine_1 = require("../ml/scoringEngine");
const enums_1 = require("../types/enums");
const logger_1 = require("../utils/logger");
class NotificationService {
    notificationRepository;
    studentRepository;
    eventRepository;
    calendarRepository;
    constructor() {
        this.notificationRepository = new notificationRepository_1.NotificationRepository();
        this.studentRepository = new studentRepository_1.StudentRepository();
        this.eventRepository = new eventRepository_1.EventRepository();
        this.calendarRepository = new calendarRepository_1.CalendarRepository();
    }
    async getStudentNotifications(studentId) {
        return this.notificationRepository.getStudentNotifications(studentId);
    }
    async markAsRead(id, studentId) {
        return this.notificationRepository.markAsRead(id, studentId);
    }
    // Category 1: Deterministic Deadline Notifications
    async generateDeadlineNotificationsForStudent(studentId) {
        const student = await this.studentRepository.findById(studentId);
        if (!student || (student.notificationPreferences && !student.notificationPreferences.enableDeadlineAlerts)) {
            return 0;
        }
        const calendarEvents = await this.calendarRepository.getStudentCalendarEvents(studentId);
        const existingNotifications = await this.notificationRepository.getStudentNotifications(studentId, 100);
        let generated = 0;
        const now = new Date().getTime();
        for (const calEvent of calendarEvents) {
            if (calEvent.status !== 'UPCOMING')
                continue;
            const deadline = new Date(calEvent.registrationDeadline).getTime();
            const diffHours = (deadline - now) / (1000 * 60 * 60);
            // Check if registration deadline is within 24-48 hours
            if (diffHours > 0 && diffHours <= 48) {
                const title = `Deadline Alert: ${calEvent.event?.title || 'Event'}`;
                const message = `Registration for "${calEvent.event?.title || 'Event'}" closes in ${Math.round(diffHours)} hours.`;
                const existing = existingNotifications.find((n) => n.eventId === calEvent.eventId && n.type === enums_1.NotificationType.DEADLINE);
                if (!existing) {
                    await this.notificationRepository.createNotification({
                        studentId,
                        eventId: calEvent.eventId,
                        title,
                        message,
                        type: enums_1.NotificationType.DEADLINE,
                    });
                    generated++;
                }
            }
        }
        return generated;
    }
    // Category 2: Recommendation Notifications (Selective delivery triggered when new event ingested)
    async triggerRecommendationNotificationsForNewEvent(eventId) {
        const event = await this.eventRepository.findById(eventId);
        if (!event)
            return 0;
        const studentProfile = await this.studentRepository.findById('sample-student-id');
        if (!studentProfile)
            return 0;
        const scoreResult = scoringEngine_1.ScoringEngine.calculateScore(studentProfile, event);
        let count = 0;
        if (scoreResult.totalScore >= 0.75) {
            const title = `New Recommended Opportunity: ${event.title}`;
            const message = `We found a high-match opportunity tailored to your profile: ${scoreResult.recommendationReason}`;
            await this.notificationRepository.createNotification({
                studentId: studentProfile.id || studentProfile.userId,
                eventId: event.id || event.eventId,
                title,
                message,
                type: enums_1.NotificationType.RECOMMENDATION,
            });
            count++;
        }
        logger_1.logger.info(`[NotificationService] Checked recommendation notifications for event ${eventId}`);
        return count;
    }
}
exports.NotificationService = NotificationService;
