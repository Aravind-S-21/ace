import { NormalizedEventPayload, RawEventImportInput } from '../types/event.types';

export interface EventProvider {
  readonly providerName: string;
  fetchEvents(): Promise<NormalizedEventPayload[]>;
}

export class EventNormalizer {
  public static normalizeRawEvent(input: RawEventImportInput): NormalizedEventPayload {
    return {
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      eligibility: input.eligibility ? input.eligibility.trim() : 'All College Students',
      requiredSkills: Array.isArray(input.requiredSkills) ? input.requiredSkills : [],
      location: input.location ? input.location.trim() : 'Online',
      duration: input.duration ? input.duration.trim() : 'N/A',
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      registrationDeadline: new Date(input.registrationDeadline),
      organizer: input.organizer ? input.organizer.trim() : 'Event Organizer',
      externalUrl: input.externalUrl,
      imageUrl: input.imageUrl,
    };
  }
}
