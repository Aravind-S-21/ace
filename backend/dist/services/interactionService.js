"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionService = void 0;
const interactionRepository_1 = require("../repositories/interactionRepository");
class InteractionService {
    interactionRepository;
    constructor() {
        this.interactionRepository = new interactionRepository_1.InteractionRepository();
    }
    async logInteraction(data) {
        return this.interactionRepository.logInteraction(data);
    }
    async getStudentInteractions(studentId) {
        return this.interactionRepository.getStudentInteractions(studentId);
    }
}
exports.InteractionService = InteractionService;
