import { AIService } from '../ai/ai.service';
import { RankingService } from '../ml/rankingService';
import { getDatabaseAdapter } from '../db/adapters/adapterFactory';
import { IDatabaseAdapter } from '../db/adapters/databaseAdapter.interface';
import { StructuredRecommendationOutput } from '../types/ai.types';
import { logger } from '../utils/logger';

export class RecommendationAgent {
  private aiService: AIService;
  private rankingService: RankingService;

  private get adapter(): IDatabaseAdapter {
    return getDatabaseAdapter();
  }

  constructor() {
    this.aiService = new AIService();
    this.rankingService = new RankingService();
  }

  public async generatePersonalizedRecommendations(student: any, finalLimit: number = 10): Promise<any[]> {
    logger.info(`[RecommendationAgent] Generating recommendations for student: ${student.fullName} (${student.id || student.userId})`);

    // Step 1: Run Deterministic Ranking Engine to get Top 50 candidates
    const rankingOutput = await this.rankingService.rankEventsForStudent(student, 50);
    const top50Candidates = rankingOutput.candidates;

    if (top50Candidates.length === 0) {
      logger.info(`[RecommendationAgent] No candidates found for student ${student.id || student.userId}`);
      return [];
    }

    // Map events with details for Agent 1 context
    const eventIds = top50Candidates.map((c) => c.eventId);
    const events: any[] = [];
    for (const eid of eventIds) {
      const ev = await this.adapter.findEventById(eid);
      if (ev) events.push(ev);
    }

    const candidatePayload = top50Candidates.map((c) => {
      const ev = events.find((e: any) => String(e.id || e.eventId) === String(c.eventId));
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
      skills: (student.studentSkills || student.skills || []).map((s: any) => s.skill?.name || s.skillName || s).filter(Boolean),
      interests: (student.interests || []).map((i: any) => i.interest?.name || i.name || i).filter(Boolean),
    };

    let aiRefined: StructuredRecommendationOutput;
    try {
      aiRefined = await this.aiService.refineRecommendations(studentProfileSummary, candidatePayload);
    } catch (err: any) {
      logger.warn(`[RecommendationAgent] AI refinement failed, using deterministic ranking fallback: ${err.message}`);
      aiRefined = {
        recommendations: candidatePayload.slice(0, finalLimit).map((c) => ({
          eventId: c.eventId,
          reason: c.recommendationReason,
          explanation: `Recommended based on matching signals: ${c.matchingSignals.join(', ')}`,
          action: 'recommend' as const,
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

    logger.info(`[RecommendationAgent] Successfully stored ${storedRecommendations.length} recommendations for student ${student.id || student.userId}`);
    return storedRecommendations;
  }
}
