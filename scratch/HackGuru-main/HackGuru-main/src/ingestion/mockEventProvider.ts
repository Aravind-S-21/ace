import { EventProvider, EventNormalizer } from './eventProvider.interface';
import { NormalizedEventPayload } from '../types/event.types';

export class MockEventProvider implements EventProvider {
  public readonly providerName = 'MOCK_ACE_PROVIDER';

  public async fetchEvents(): Promise<NormalizedEventPayload[]> {
    const now = new Date();
    const rawEvents = [
      {
        title: 'HackGURU AI Ingestion Hackathon 2026',
        description: 'Ingested AI Hackathon for testing real-time event pipeline.',
        category: 'AI & ML',
        eligibility: 'All Engineering Students',
        requiredSkills: ['Python', 'TypeScript', 'Gemini API'],
        location: 'Bengaluru / Online',
        duration: '36 Hours',
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        registrationDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        organizer: 'AllCollegeEvent AI Team',
        externalUrl: 'https://allcollegeevent.com/events/imported-1',
      },
    ];

    return rawEvents.map((r) => EventNormalizer.normalizeRawEvent(r));
  }
}
