"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingConfigService = exports.defaultRankingConfig = void 0;
exports.defaultRankingConfig = {
    weights: {
        branchMatch: 0.15,
        skillOverlap: 0.25,
        interestMatch: 0.20,
        careerGoalRelevance: 0.20,
        locationEligibility: 0.10,
        interactionHistory: 0.05,
        freshnessAndUrgency: 0.05,
    },
    minCandidateScore: 0.1,
    candidateLimit: 50,
    finalRecommendationLimit: 10,
};
class RankingConfigService {
    static instanceConfig = { ...exports.defaultRankingConfig };
    static getConfig() {
        return this.instanceConfig;
    }
    static updateWeights(newWeights) {
        this.instanceConfig.weights = {
            ...this.instanceConfig.weights,
            ...newWeights,
        };
        return this.instanceConfig;
    }
    static setConfig(config) {
        this.instanceConfig = config;
    }
    static resetToDefault() {
        this.instanceConfig = { ...exports.defaultRankingConfig };
    }
}
exports.RankingConfigService = RankingConfigService;
