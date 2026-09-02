"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingService = void 0;
const candidateFilter_1 = require("./candidateFilter");
const scoringEngine_1 = require("./scoringEngine");
const interactionRepository_1 = require("../repositories/interactionRepository");
const rankingConfig_1 = require("../config/rankingConfig");
class RankingService {
    candidateFilter;
    interactionRepository;
    constructor() {
        this.candidateFilter = new candidateFilter_1.CandidateFilter();
        this.interactionRepository = new interactionRepository_1.InteractionRepository();
    }
    async rankEventsForStudent(student, topLimit = 50) {
        const config = rankingConfig_1.RankingConfigService.getConfig();
        // 1. Get candidate pool from candidate filter
        const candidateEvents = await this.candidateFilter.getCandidatePool(student, config.candidateLimit);
        // 2. Fetch student interactions
        const interactions = await this.interactionRepository.getStudentInteractions(student.id || student.userId);
        // 3. Score all candidates using deterministic scoring engine
        const scoredCandidates = candidateEvents.map((event) => scoringEngine_1.ScoringEngine.calculateScore(student, event, interactions));
        // 4. Sort candidates by total score descending
        const sortedCandidates = scoredCandidates
            .filter((candidate) => candidate.totalScore >= config.minCandidateScore)
            .sort((a, b) => b.totalScore - a.totalScore);
        const topCandidates = sortedCandidates.slice(0, topLimit);
        return {
            studentId: student.id || student.userId,
            candidateCount: topCandidates.length,
            candidates: topCandidates,
        };
    }
}
exports.RankingService = RankingService;
