"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const eventRepository_1 = require("../repositories/eventRepository");
const eventIntelligence_agent_1 = require("../agents/eventIntelligence.agent");
const notificationService_1 = require("./notificationService");
class EventService {
    eventRepository;
    eventIntelligenceAgent;
    notificationService;
    constructor() {
        this.eventRepository = new eventRepository_1.EventRepository();
        this.eventIntelligenceAgent = new eventIntelligence_agent_1.EventIntelligenceAgent();
        this.notificationService = new notificationService_1.NotificationService();
    }
    async getEvents(params) {
        return this.eventRepository.findAll(params);
    }
    async getEventById(id) {
        const event = await this.eventRepository.findById(id);
        if (!event) {
            throw new Error(`Event with ID ${id} not found.`);
        }
        return event;
    }
    async createAndAnalyzeEvent(input) {
        const event = await this.eventRepository.createEvent(input);
        // Trigger Agent 2 analysis
        await this.eventIntelligenceAgent.processEventIntelligence(event.id || event.eventId);
        // Trigger Recommendation Notifications for highly relevant students
        await this.notificationService.triggerRecommendationNotificationsForNewEvent(event.id || event.eventId);
        return this.getEventById(event.id || event.eventId);
    }
    async reanalyzeEvent(id) {
        await this.eventIntelligenceAgent.processEventIntelligence(id, true);
        return this.getEventById(id);
    }
}
exports.EventService = EventService;
