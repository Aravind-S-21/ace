import { ScoringEngine } from '../recommendation/scoringEngine';
import { CandidateFilter } from '../recommendation/candidateFilter';
import { RankingService } from '../recommendation/rankingService';

export { ScoringEngine, CandidateFilter, RankingService };

export class RankingEngine {
  private rankingService: RankingService;

  constructor() {
    this.rankingService = new RankingService();
  }

  public async rankEventsForStudent(studentProfile: any, candidatePoolLimit: number = 50) {
    return this.rankingService.rankEventsForStudent(studentProfile, candidatePoolLimit);
  }
}
