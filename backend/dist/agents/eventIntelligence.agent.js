"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventIntelligenceAgent = void 0;
const ai_service_1 = require("../ai/ai.service");
const eventRepository_1 = require("../repositories/eventRepository");
const logger_1 = require("../utils/logger");
class EventIntelligenceAgent {
    aiService;
    eventRepository;
    constructor() {
        this.aiService = new ai_service_1.AIService();
        this.eventRepository = new eventRepository_1.EventRepository();
    }
    async processEventIntelligence(eventId, forceReanalyze = false) {
        const event = await this.eventRepository.findById(eventId);
        if (!event) {
            throw new Error(`Event with ID ${eventId} not found.`);
        }
        const currentHash = this.aiService.computeEventContentHash(event);
        const intelligence = event.aiAnalysis || event.intelligence;
        if (!forceReanalyze && intelligence && intelligence.contentHash === currentHash) {
            logger_1.logger.info(`[EventIntelligenceAgent] Event ${eventId} content unchanged (hash match). Returning cached intelligence.`);
            return intelligence;
        }
        logger_1.logger.info(`[EventIntelligenceAgent] Invoking AI Provider for Event ${eventId} (${event.title})...`);
        const rawSkills = Array.isArray(event.requiredSkills)
            ? event.requiredSkills
            : typeof event.requiredSkills === 'string'
                ? event.requiredSkills.split(',').map((s) => s.trim())
                : [];
        const intelligenceOutput = await this.aiService.analyzeEvent({
            title: event.title,
            description: event.description,
            category: event.category,
            eligibility: event.eligibility,
            requiredSkills: rawSkills,
            location: event.location,
            duration: event.duration,
            registrationDeadline: event.registrationDeadline,
            organizer: event.organizer,
        });
        const savedIntelligence = await this.eventRepository.upsertIntelligence(eventId, {
            domains: intelligenceOutput.domains,
            skills: intelligenceOutput.skills,
            targetAudience: intelligenceOutput.targetAudience,
            difficulty: intelligenceOutput.difficulty,
            careerPaths: intelligenceOutput.careerPaths,
            prerequisites: intelligenceOutput.prerequisites,
            learningOutcomes: intelligenceOutput.learningOutcomes,
            eventType: intelligenceOutput.eventType,
            contentHash: currentHash,
        });
        logger_1.logger.info(`[EventIntelligenceAgent] Successfully stored event intelligence for event ${eventId}`);
        return savedIntelligence;
    }
}
exports.EventIntelligenceAgent = EventIntelligenceAgent;
