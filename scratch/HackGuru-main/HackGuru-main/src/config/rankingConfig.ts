export interface RankingWeights {
  branchMatch: number;
  skillOverlap: number;
  interestMatch: number;
  careerGoalRelevance: number;
  locationEligibility: number;
  interactionHistory: number;
  freshnessAndUrgency: number;
}

export interface RankingConfig {
  weights: RankingWeights;
  minCandidateScore: number;
  candidateLimit: number;
  finalRecommendationLimit: number;
}

export const defaultRankingConfig: RankingConfig = {
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

export class RankingConfigService {
  private static instanceConfig: RankingConfig = { ...defaultRankingConfig };

  public static getConfig(): RankingConfig {
    return this.instanceConfig;
  }

  public static updateWeights(newWeights: Partial<RankingWeights>): RankingConfig {
    this.instanceConfig.weights = {
      ...this.instanceConfig.weights,
      ...newWeights,
    };
    return this.instanceConfig;
  }

  public static setConfig(config: RankingConfig): void {
    this.instanceConfig = config;
  }

  public static resetToDefault(): void {
    this.instanceConfig = { ...defaultRankingConfig };
  }
}
