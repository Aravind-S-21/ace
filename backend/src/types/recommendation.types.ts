export interface CandidateEventScore {
  eventId: string;
  totalScore: number;
  breakdown: {
    branchScore: number;
    skillScore: number;
    interestScore: number;
    careerGoalScore: number;
    locationScore: number;
    interactionScore: number;
    freshnessScore: number;
  };
  matchingSignals: string[];
  missingRequirements: string[];
  recommendationReason: string;
}

export interface RecommendationEngineOutput {
  studentId: string;
  candidateCount: number;
  candidates: CandidateEventScore[];
}
