import { AIProvider, AIProviderResponse } from './ai.provider.interface';
import { StructuredEventIntelligence, StructuredRecommendationOutput } from '../types/ai.types';

export class MockAIProvider implements AIProvider {
  public readonly providerName = 'MOCK';
  public readonly modelName = 'mock-intelligence-v1';

  public async analyzeEvent(event: {
    title: string;
    description: string;
    category: string;
    eligibility: string;
    requiredSkills: string[];
    location: string;
    duration: string;
    registrationDeadline: Date | string;
    organizer: string;
  }): Promise<AIProviderResponse<StructuredEventIntelligence>> {
    const startTime = Date.now();

    const isAI = event.category.toLowerCase().includes('ai') || event.title.toLowerCase().includes('ai');

    const intelligence: StructuredEventIntelligence = {
      domains: isAI
        ? ['Artificial Intelligence', 'Generative AI', 'Machine Learning']
        : ['Web Development', 'Software Engineering'],
      skills: event.requiredSkills.length > 0 ? event.requiredSkills : (isAI ? ['Python', 'PyTorch'] : ['TypeScript', 'React']),
      targetAudience: ['Undergraduate Students', 'Early Career Engineers'],
      difficulty: 'INTERMEDIATE',
      careerPaths: isAI ? ['AI Engineer', 'Machine Learning Scientist'] : ['Full Stack Engineer', 'Software Developer'],
      prerequisites: isAI ? ['Basic Python', 'Linear Algebra'] : ['Web Basics'],
      learningOutcomes: ['Practical Project Building', 'Team Collaboration', 'Industry Recognition'],
      eventType: event.title.toLowerCase().includes('hackathon')
        ? 'HACKATHON'
        : event.title.toLowerCase().includes('workshop')
        ? 'WORKSHOP'
        : 'COMPETITION',
    };

    const durationMs = Date.now() - startTime;

    return {
      data: intelligence,
      metrics: {
        provider: 'MOCK',
        model: this.modelName,
        requestType: 'EVENT_INTELLIGENCE',
        inputTokens: 150,
        outputTokens: 80,
        totalTokens: 230,
        estimatedCost: 0.0,
        durationMs,
        success: true,
      },
    };
  }

  public async refineRecommendations(
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
  ): Promise<AIProviderResponse<StructuredRecommendationOutput>> {
    const startTime = Date.now();

    const recommendations = topCandidates.slice(0, 10).map((candidate) => ({
      eventId: candidate.eventId,
      reason: candidate.recommendationReason,
      explanation: `Recommended for ${studentProfile.fullName} (${studentProfile.branch}, Year ${studentProfile.yearOfStudy}) pursuing a career as ${studentProfile.careerGoal}. Matching skills: ${studentProfile.skills.slice(0, 3).join(', ')}.`,
      action: 'recommend' as const,
    }));

    const durationMs = Date.now() - startTime;

    return {
      data: { recommendations },
      metrics: {
        provider: 'MOCK',
        model: this.modelName,
        requestType: 'RECOMMENDATION_REFINEMENT',
        inputTokens: 400,
        outputTokens: 250,
        totalTokens: 650,
        estimatedCost: 0.0,
        durationMs,
        success: true,
      },
    };
  }
}
