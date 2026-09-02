import { AdapterFactory } from '../adapters/adapterFactory';
import { IDatabaseAdapter } from '../adapters/databaseAdapter.interface';

export class InteractionRepository {
  private get adapter(): IDatabaseAdapter {
    return AdapterFactory.getAdapter();
  }

  public async logInteraction(data: {
    studentId?: string | bigint;
    userId?: string | bigint;
    eventId: string | bigint;
    action: string;
    metadata?: any;
  }): Promise<any> {
    const targetUserId: string | bigint = data.userId ?? data.studentId ?? '1';
    return this.adapter.logInteraction({
      userId: targetUserId,
      eventId: data.eventId,
      action: data.action,
      metadata: data.metadata,
    });
  }

  public async getStudentInteractions(studentId: string | bigint): Promise<any[]> {
    return this.adapter.getStudentInteractions(studentId);
  }
}
