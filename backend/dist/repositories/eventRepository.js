"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRepository = void 0;
const adapterFactory_1 = require("../db/adapters/adapterFactory");
class EventRepository {
    get adapter() {
        return (0, adapterFactory_1.getDatabaseAdapter)();
    }
    async findAll(params) {
        return this.adapter.listEvents(params);
    }
    async findById(id) {
        return this.adapter.getEventById(id);
    }
    async createEvent(data) {
        return this.adapter.createEvent(data);
    }
    async upsertIntelligence(eventId, data) {
        return this.adapter.upsertEventAiAnalysis(eventId, data);
    }
    async getCandidateEventsForStudent(limit = 500) {
        return this.adapter.listEvents({ limit });
    }
}
exports.EventRepository = EventRepository;
