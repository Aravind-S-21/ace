"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateFilter = void 0;
const eventRepository_1 = require("../repositories/eventRepository");
class CandidateFilter {
    eventRepository;
    constructor() {
        this.eventRepository = new eventRepository_1.EventRepository();
    }
    async getCandidatePool(student, candidateLimit = 500) {
        // 1. Fetch raw candidate pool from DB
        const allEvents = await this.eventRepository.getCandidateEventsForStudent(candidateLimit);
        // 2. Perform initial pre-filter: discard events with deadlines far in the past (> 7 days past)
        const now = new Date().getTime();
        const activeEvents = allEvents.filter((ev) => {
            // In Prisma, dates might be Date objects or strings, handle accordingly
            if (!ev.registrationDeadline)
                return true;
            const deadline = new Date(ev.registrationDeadline).getTime();
            if (isNaN(deadline))
                return true;
            return (now - deadline) < 7 * 24 * 60 * 60 * 1000;
        });
        return activeEvents;
    }
}
exports.CandidateFilter = CandidateFilter;
