import { getDatabaseAdapter } from '../db/adapters/adapterFactory';
import { IDatabaseAdapter } from '../db/adapters/databaseAdapter.interface';

export class EventRepository {
  private get adapter(): IDatabaseAdapter {
    return getDatabaseAdapter();
  }

  public async findAll(params?: {
    category?: string;
    location?: string;
    search?: string;
    limit?: number;
    skip?: number;
  }): Promise<any[]> {
    return this.adapter.listEvents(params);
  }

  public async findById(id: string | bigint): Promise<any | null> {
    return this.adapter.getEventById(id);
  }

  public async createEvent(data: any): Promise<any> {
    return this.adapter.createEvent(data);
  }

  public async upsertIntelligence(
    eventId: string | bigint,
    data: any
  ): Promise<any> {
    return this.adapter.upsertEventAiAnalysis(eventId, data);
  }

  public async getCandidateEventsForStudent(limit: number = 500): Promise<any[]> {
    return this.adapter.listEvents({ limit });
  }
}
