import { EventRepository } from '../repositories/eventRepository';
import { EventIntelligenceAgent } from '../agents/eventIntelligence.agent';
import { NotificationService } from './notificationService';
import { RawEventImportInput } from '../types/event.types';
import { EventNormalizer } from '../ingestion/eventProvider.interface';

export class EventService {
  private eventRepository: EventRepository;
  private eventIntelligenceAgent: EventIntelligenceAgent;
  private notificationService: NotificationService;

  constructor() {
    this.eventRepository = new EventRepository();
    this.eventIntelligenceAgent = new EventIntelligenceAgent();
    this.notificationService = new NotificationService();
  }

  public async getEvents(params?: { category?: string; location?: string; search?: string }): Promise<any[]> {
    return this.eventRepository.findAll(params);
  }

  public async getEventById(id: string): Promise<any> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new Error(`Event with ID ${id} not found.`);
    }
    return event;
  }

  public async createAndAnalyzeEvent(input: RawEventImportInput): Promise<any> {
    const normalized = EventNormalizer.normalizeRawEvent(input);
    const event = await this.eventRepository.createEvent(normalized);

    // Trigger Agent 2 analysis
    await this.eventIntelligenceAgent.processEventIntelligence(event.id);

    // Trigger Recommendation Notifications for highly relevant students
    await this.notificationService.triggerRecommendationNotificationsForNewEvent(event.id);

    return this.getEventById(event.id);
  }

  public async reanalyzeEvent(id: string): Promise<any> {
    await this.eventIntelligenceAgent.processEventIntelligence(id, true);
    return this.getEventById(id);
  }
}
