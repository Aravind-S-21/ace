"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionService = void 0;
const mockEventProvider_1 = require("../ingestion/mockEventProvider");
const eventService_1 = require("./eventService");
class IngestionService {
    eventService;
    defaultProvider;
    constructor() {
        this.eventService = new eventService_1.EventService();
        this.defaultProvider = new mockEventProvider_1.MockEventProvider();
    }
    async importEventsFromPayload(eventsPayload) {
        const importedEvents = [];
        for (const raw of eventsPayload) {
            const created = await this.eventService.createAndAnalyzeEvent(raw);
            importedEvents.push(created);
        }
        return importedEvents;
    }
    async importFromProvider(provider) {
        const activeProvider = provider || this.defaultProvider;
        const normalizedEvents = await activeProvider.fetchEvents();
        const importedEvents = [];
        for (const eventData of normalizedEvents) {
            const rawInput = {
                title: eventData.title,
                description: eventData.description,
                category: eventData.category,
                eligibility: eventData.eligibility,
                requiredSkills: eventData.requiredSkills,
                location: eventData.location,
                duration: eventData.duration,
                startDate: eventData.startDate.toISOString(),
                endDate: eventData.endDate?.toISOString(),
                registrationDeadline: eventData.registrationDeadline.toISOString(),
                organizer: eventData.organizer,
                externalUrl: eventData.externalUrl,
                imageUrl: eventData.imageUrl,
            };
            const created = await this.eventService.createAndAnalyzeEvent(rawInput);
            importedEvents.push(created);
        }
        return importedEvents;
    }
}
exports.IngestionService = IngestionService;
