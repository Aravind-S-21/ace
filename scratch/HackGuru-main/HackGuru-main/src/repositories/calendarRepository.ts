import { AdapterFactory } from '../adapters/adapterFactory';
import { IDatabaseAdapter } from '../adapters/databaseAdapter.interface';

export class CalendarRepository {
  private get adapter(): IDatabaseAdapter {
    return AdapterFactory.getAdapter();
  }

  public async addCalendarEvent(data: {
    studentId: string;
    eventId: string;
    startDate: Date;
    registrationDeadline: Date;
    reminderTime: Date;
    reminderType?: string;
    status?: string;
  }): Promise<any> {
    return this.adapter.addCalendarEvent(data);
  }

  public async getStudentCalendarEvents(studentId: string): Promise<any[]> {
    return this.adapter.getStudentCalendarEvents(studentId);
  }

  public async removeCalendarEvent(id: string, studentId: string): Promise<boolean> {
    return this.adapter.removeCalendarEvent(id);
  }
}
