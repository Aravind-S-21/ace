import { AIService } from '../ai/ai.service';
import { EventRepository } from '../repositories/eventRepository';
import { StructuredEventIntelligence } from '../types/ai.types';
import { logger } from '../utils/logger';

export class EventIntelligenceAgent {
  private aiService: AIService;
  private eventRepository: EventRepository;

  constructor() {
    this.aiService = new AIService();
    this.eventRepository = new EventRepository();
  }

  public async processEventIntelligence(eventId: string, forceReanalyze: boolean = false): Promise<any> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found.`);
    }

    const currentHash = this.aiService.computeEventContentHash(event);

    if (!forceReanalyze && event.intelligence && event.intelligence.contentHash === currentHash) {
      logger.info(`[EventIntelligenceAgent] Event ${eventId} content unchanged (hash match). Returning cached intelligence.`);
      return event.intelligence;
    }

    logger.info(`[EventIntelligenceAgent] Invoking AI Provider for Event ${eventId} (${event.title})...`);

    const rawSkills = Array.isArray(event.requiredSkills)
      ? event.requiredSkills
      : typeof event.requiredSkills === 'string'
      ? (event.requiredSkills as string).split(',').map((s) => s.trim())
      : [];

    const intelligenceOutput: StructuredEventIntelligence = await this.aiService.analyzeEvent({
      title: event.title,
      description: event.description,
      category: event.category,
      eligibility: event.eligibility,
      requiredSkills: rawSkills,
      location: event.location,
      duration: event.duration,
      registrationDeadline: event.registrationDeadline,
      organizer: event.organizer,
    });

    const savedIntelligence = await this.eventRepository.upsertIntelligence(eventId, {
      domains: intelligenceOutput.domains,
      skills: intelligenceOutput.skills,
      targetAudience: intelligenceOutput.targetAudience,
      difficulty: intelligenceOutput.difficulty,
      careerPaths: intelligenceOutput.careerPaths,
      prerequisites: intelligenceOutput.prerequisites,
      learningOutcomes: intelligenceOutput.learningOutcomes,
      eventType: intelligenceOutput.eventType,
      contentHash: currentHash,
    });

    logger.info(`[EventIntelligenceAgent] Successfully stored event intelligence for event ${eventId}`);
    return savedIntelligence;
  }
}
