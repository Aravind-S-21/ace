import { EventRepository } from '../repositories/eventRepository';

export class CandidateFilter {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  public async getCandidatePool(student: any, candidateLimit: number = 500): Promise<any[]> {
    // 1. Fetch raw candidate pool from DB
    const allEvents = await this.eventRepository.getCandidateEventsForStudent(candidateLimit);

    // 2. Perform initial pre-filter: discard events with deadlines far in the past (> 7 days past)
    const now = new Date().getTime();
    const activeEvents = allEvents.filter((ev) => {
      const deadline = new Date(ev.registrationDeadline).getTime();
      return (now - deadline) < 7 * 24 * 60 * 60 * 1000;
    });

    return activeEvents;
  }
}
