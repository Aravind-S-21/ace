import { StructuredEventIntelligence, StructuredRecommendationOutput, AIUsageMetrics } from '../../types/ai.types';

export interface AIProviderResponse<T> {
  data: T;
  metrics: AIUsageMetrics;
}

export interface AIProvider {
  readonly providerName: string;
  readonly modelName: string;

  analyzeEvent(event: {
    title: string;
    description: string;
    category: string;
    eligibility: string;
    requiredSkills: string[];
    location: string;
    duration: string;
    registrationDeadline: Date | string;
    organizer: string;
  }): Promise<AIProviderResponse<StructuredEventIntelligence>>;

  refineRecommendations(
    studentProfile: {
      fullName: string;
      branch: string;
      yearOfStudy: number;
      careerGoal: string;
      location: string;
      skills: string[];
      interests: string[];
      recentInteractions?: string[];
    },
    topCandidates: Array<{
      eventId: string;
      title: string;
      category: string;
      score: number;
      matchingSignals: string[];
      missingRequirements: string[];
      recommendationReason: string;
    }>
  ): Promise<AIProviderResponse<StructuredRecommendationOutput>>;
}
