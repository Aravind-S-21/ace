import { AIGateway } from './gateway/aiGateway';
import { StructuredEventIntelligence, StructuredRecommendationOutput } from '../types/ai.types';

export class AIService {
  private gateway: AIGateway;

  constructor() {
    this.gateway = new AIGateway();
  }

  public computeEventContentHash(eventData: any): string {
    return this.gateway.computeEventContentHash(eventData);
  }

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
  }): Promise<StructuredEventIntelligence> {
    return this.gateway.analyzeEvent(event);
  }

  public async refineRecommendations(
    studentProfile: any,
    topCandidates: any[]
  ): Promise<StructuredRecommendationOutput> {
    return this.gateway.refineRecommendations(studentProfile, topCandidates);
  }

  public getGatewayStatuses() {
    return this.gateway.getPoolStatuses();
  }
}
