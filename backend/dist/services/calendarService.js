"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const calendarRepository_1 = require("../repositories/calendarRepository");
const eventRepository_1 = require("../repositories/eventRepository");
const interactionRepository_1 = require("../repositories/interactionRepository");
const enums_1 = require("../types/enums");
class CalendarService {
    calendarRepository;
    eventRepository;
    interactionRepository;
    constructor() {
        this.calendarRepository = new calendarRepository_1.CalendarRepository();
        this.eventRepository = new eventRepository_1.EventRepository();
        this.interactionRepository = new interactionRepository_1.InteractionRepository();
    }
    async addCalendarEvent(data) {
        const event = await this.eventRepository.findById(data.eventId);
        if (!event) {
            throw new Error(`Event with ID ${data.eventId} not found.`);
        }
        const reminderType = data.reminderType || 'REGISTRATION_DEADLINE';
        let reminderTime;
        if (reminderType === 'EVENT_START') {
            reminderTime = new Date(new Date(event.startDate || event.registrationDeadline).getTime() - 24 * 60 * 60 * 1000); // 1 day before event start
        }
        else if (reminderType === 'CUSTOM' && data.customReminderTime) {
            reminderTime = new Date(data.customReminderTime);
        }
        else {
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
            action: enums_1.ActionType.CALENDAR_ADD,
            metadata: { reminderType, reminderTime: reminderTime.toISOString() },
        });
        return calendarEvent;
    }
    async getStudentCalendar(studentId) {
        return this.calendarRepository.getStudentCalendarEvents(studentId);
    }
    async removeCalendarEvent(id, studentId) {
        return this.calendarRepository.removeCalendarEvent(id, studentId);
    }
}
exports.CalendarService = CalendarService;
