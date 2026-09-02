"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationAgent = void 0;
const ai_service_1 = require("../ai/ai.service");
const rankingService_1 = require("../ml/rankingService");
const adapterFactory_1 = require("../db/adapters/adapterFactory");
const logger_1 = require("../utils/logger");
class RecommendationAgent {
    aiService;
    rankingService;
    get adapter() {
        return (0, adapterFactory_1.getDatabaseAdapter)();
    }
    constructor() {
        this.aiService = new ai_service_1.AIService();
        this.rankingService = new rankingService_1.RankingService();
    }
    async generatePersonalizedRecommendations(student, finalLimit = 10) {
        logger_1.logger.info(`[RecommendationAgent] Generating recommendations for student: ${student.fullName} (${student.id || student.userId})`);
        // Step 1: Run Deterministic Ranking Engine to get Top 50 candidates
        const rankingOutput = await this.rankingService.rankEventsForStudent(student, 50);
        const top50Candidates = rankingOutput.candidates;
        if (top50Candidates.length === 0) {
            logger_1.logger.info(`[RecommendationAgent] No candidates found for student ${student.id || student.userId}`);
            return [];
        }
        // Map events with details for Agent 1 context
        const eventIds = top50Candidates.map((c) => c.eventId);
        const events = [];
        for (const eid of eventIds) {
            const ev = await this.adapter.findEventById(eid);
            if (ev)
                events.push(ev);
        }
        const candidatePayload = top50Candidates.map((c) => {
            const ev = events.find((e) => String(e.id || e.eventId) === String(c.eventId));
            return {
                eventId: String(c.eventId),
                title: ev?.title || 'Event',
                category: ev?.category || 'General',
                score: c.totalScore,
                matchingSignals: c.matchingSignals,
                missingRequirements: c.missingRequirements,
                recommendationReason: c.recommendationReason,
            };
        });
        // Step 2: Agent 1 refines top candidates using AI Service
        const studentProfileSummary = {
            fullName: student.fullName,
            branch: student.branch || student.department,
            yearOfStudy: student.yearOfStudy,
            careerGoal: student.careerGoal,
            location: student.location,
            skills: (student.studentSkills || student.skills || []).map((s) => s.skill?.name || s.skillName || s).filter(Boolean),
            interests: (student.interests || []).map((i) => i.interest?.name || i.name || i).filter(Boolean),
        };
        let aiRefined;
        try {
            aiRefined = await this.aiService.refineRecommendations(studentProfileSummary, candidatePayload);
        }
        catch (err) {
            logger_1.logger.warn(`[RecommendationAgent] AI refinement failed, using deterministic ranking fallback: ${err.message}`);
            aiRefined = {
                recommendations: candidatePayload.slice(0, finalLimit).map((c) => ({
                    eventId: c.eventId,
                    reason: c.recommendationReason,
                    explanation: `Recommended based on matching signals: ${c.matchingSignals.join(', ')}`,
                    action: 'recommend',
                })),
            };
        }
        // Step 3: Store refined recommendations in database via Database Adapter
        const storedRecommendations = [];
        for (const item of aiRefined.recommendations.slice(0, finalLimit)) {
            const candidateScore = top50Candidates.find((c) => String(c.eventId) === String(item.eventId));
            const score = candidateScore ? candidateScore.totalScore : 0.8;
            const rec = await this.adapter.upsertRecommendation({
                studentId: student.id || student.userId,
                eventId: item.eventId,
                score,
                reason: item.reason,
                explanation: item.explanation,
                agentRefined: true,
                status: 'ACTIVE',
            });
            storedRecommendations.push(rec);
        }
        logger_1.logger.info(`[RecommendationAgent] Successfully stored ${storedRecommendations.length} recommendations for student ${student.id || student.userId}`);
        return storedRecommendations;
    }
}
exports.RecommendationAgent = RecommendationAgent;
