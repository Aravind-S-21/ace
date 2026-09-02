import { EventRepository } from '../repositories/eventRepository';
import { EventIntelligenceAgent } from '../agents/eventIntelligence.agent';
import { NotificationService } from './notificationService';

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

  public async getEventById(id: string | bigint): Promise<any> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new Error(`Event with ID ${id} not found.`);
    }
    return event;
  }

  public async createAndAnalyzeEvent(input: any): Promise<any> {
    const event = await this.eventRepository.createEvent(input);

    // Trigger Agent 2 analysis
    await this.eventIntelligenceAgent.processEventIntelligence(event.id || event.eventId);

    // Trigger Recommendation Notifications for highly relevant students
    await this.notificationService.triggerRecommendationNotificationsForNewEvent(event.id || event.eventId);

    return this.getEventById(event.id || event.eventId);
  }

  public async reanalyzeEvent(id: string | bigint): Promise<any> {
    await this.eventIntelligenceAgent.processEventIntelligence(id, true);
    return this.getEventById(id);
  }
}
