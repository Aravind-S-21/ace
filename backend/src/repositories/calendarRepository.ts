import { getDatabaseAdapter } from '../db/adapters/adapterFactory';
import { IDatabaseAdapter } from '../db/adapters/databaseAdapter.interface';

export class CalendarRepository {
  private get adapter(): IDatabaseAdapter {
    return getDatabaseAdapter();
  }

  public async addCalendarEvent(data: {
    studentId: string | bigint;
    eventId: string | bigint;
    startDate: Date;
    registrationDeadline: Date;
    reminderTime: Date;
    reminderType?: string;
    status?: string;
  }): Promise<any> {
    return this.adapter.addCalendarEvent(data);
  }

  public async getStudentCalendarEvents(studentId: string | bigint): Promise<any[]> {
    return this.adapter.getStudentCalendarEvents(studentId);
  }

  public async removeCalendarEvent(id: string, studentId?: string | bigint): Promise<boolean> {
    const res = await this.adapter.removeCalendarEvent(id);
    return res.success || !!res;
  }
}
