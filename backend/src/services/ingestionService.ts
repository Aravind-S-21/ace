import { EventProvider } from '../ingestion/eventProvider.interface';
import { MockEventProvider } from '../ingestion/mockEventProvider';
import { EventService } from './eventService';
import { RawEventImportInput } from '../types/event.types';

export class IngestionService {
  private eventService: EventService;
  private defaultProvider: EventProvider;

  constructor() {
    this.eventService = new EventService();
    this.defaultProvider = new MockEventProvider();
  }

  public async importEventsFromPayload(eventsPayload: RawEventImportInput[]): Promise<any[]> {
    const importedEvents = [];
    for (const raw of eventsPayload) {
      const created = await this.eventService.createAndAnalyzeEvent(raw);
      importedEvents.push(created);
    }
    return importedEvents;
  }

  public async importFromProvider(provider?: EventProvider): Promise<any[]> {
    const activeProvider = provider || this.defaultProvider;
    const normalizedEvents = await activeProvider.fetchEvents();

    const importedEvents = [];
    for (const eventData of normalizedEvents) {
      const rawInput: RawEventImportInput = {
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        eligibility: eventData.eligibility,
        requiredSkills: eventData.requiredSkills,
        location: eventData.location,
        duration: eventData.duration,
        startDate: eventData.startDate.toISOString(),
        endDate: eventData.endDate?.toISOString(),
        registrationDeadline: eventData.registrationDeadline.toISOString(),
        organizer: eventData.organizer,
        externalUrl: eventData.externalUrl,
        imageUrl: eventData.imageUrl,
      };
      const created = await this.eventService.createAndAnalyzeEvent(rawInput);
      importedEvents.push(created);
    }

    return importedEvents;
  }
}
