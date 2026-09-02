"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionRepository = void 0;
const adapterFactory_1 = require("../db/adapters/adapterFactory");
class InteractionRepository {
    get adapter() {
        return (0, adapterFactory_1.getDatabaseAdapter)();
    }
    async logInteraction(data) {
        const targetUserId = data.userId ?? data.studentId ?? '1';
        return this.adapter.logInteraction({
            userId: targetUserId,
            eventId: data.eventId,
            action: data.action,
            metadata: data.metadata,
        });
    }
    async getStudentInteractions(studentId) {
        return this.adapter.getStudentInteractions(studentId);
    }
}
exports.InteractionRepository = InteractionRepository;
