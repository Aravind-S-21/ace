export interface StructuredEventIntelligence {
  domains: string[];
  skills: string[];
  targetAudience: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
  careerPaths: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  eventType: 'HACKATHON' | 'WORKSHOP' | 'INTERNSHIP' | 'SEMINAR' | 'COMPETITION' | 'PROJECT_COLLAB' | 'OTHER';
}

export interface RecommendationReasoning {
  eventId: string;
  reason: string;
  explanation: string;
  action: 'recommend' | 'skip';
}

export interface StructuredRecommendationOutput {
  recommendations: RecommendationReasoning[];
}

export interface AIUsageMetrics {
  provider: 'GEMINI' | 'OPENAI' | 'HUGGINGFACE' | 'MOCK';
  model: string;
  requestType: 'EVENT_INTELLIGENCE' | 'RECOMMENDATION_REFINEMENT';
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  estimatedCost?: number;
  durationMs: number;
  success: boolean;
  errorMessage?: string;
}
