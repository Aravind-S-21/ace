"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const aiGateway_1 = require("./gateway/aiGateway");
class AIService {
    gateway;
    constructor() {
        this.gateway = new aiGateway_1.AIGateway();
    }
    computeEventContentHash(eventData) {
        return this.gateway.computeEventContentHash(eventData);
    }
    async analyzeEvent(event) {
        return this.gateway.analyzeEvent(event);
    }
    async refineRecommendations(studentProfile, topCandidates) {
        return this.gateway.refineRecommendations(studentProfile, topCandidates);
    }
    getGatewayStatuses() {
        return this.gateway.getPoolStatuses();
    }
}
exports.AIService = AIService;
