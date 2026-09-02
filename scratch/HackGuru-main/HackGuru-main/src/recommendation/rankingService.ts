import { CandidateFilter } from './candidateFilter';
import { ScoringEngine } from './scoringEngine';
import { InteractionRepository } from '../repositories/interactionRepository';
import { RankingConfigService } from '../config/rankingConfig';
import { CandidateEventScore, RecommendationEngineOutput } from '../types/recommendation.types';

export class RankingService {
  private candidateFilter: CandidateFilter;
  private interactionRepository: InteractionRepository;

  constructor() {
    this.candidateFilter = new CandidateFilter();
    this.interactionRepository = new InteractionRepository();
  }

  public async rankEventsForStudent(
    student: any,
    topLimit: number = 50
  ): Promise<RecommendationEngineOutput> {
    const config = RankingConfigService.getConfig();

    // 1. Get candidate pool from candidate filter
    const candidateEvents = await this.candidateFilter.getCandidatePool(student, config.candidateLimit);

    // 2. Fetch student interactions
    const interactions = await this.interactionRepository.getStudentInteractions(student.id);

    // 3. Score all candidates using deterministic scoring engine
    const scoredCandidates: CandidateEventScore[] = candidateEvents.map((event) =>
      ScoringEngine.calculateScore(student, event, interactions)
    );

    // 4. Sort candidates by total score descending
    const sortedCandidates = scoredCandidates
      .filter((candidate) => candidate.totalScore >= config.minCandidateScore)
      .sort((a, b) => b.totalScore - a.totalScore);

    const topCandidates = sortedCandidates.slice(0, topLimit);

    return {
      studentId: student.id,
      candidateCount: topCandidates.length,
      candidates: topCandidates,
    };
  }
}
