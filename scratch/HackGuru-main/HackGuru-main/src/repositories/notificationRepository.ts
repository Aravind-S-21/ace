import { AdapterFactory } from '../adapters/adapterFactory';
import { IDatabaseAdapter } from '../adapters/databaseAdapter.interface';
import { NotificationType } from '../types/enums';

export class NotificationRepository {
  private get adapter(): IDatabaseAdapter {
    return AdapterFactory.getAdapter();
  }

  public async createNotification(data: {
    studentId: string;
    eventId?: string;
    title: string;
    message: string;
    type: NotificationType;
  }): Promise<any> {
    return this.adapter.createNotification(data);
  }

  public async getStudentNotifications(studentId: string, limit: number = 20): Promise<any[]> {
    return this.adapter.getStudentNotifications(studentId);
  }

  public async markAsRead(id: string, studentId: string): Promise<boolean> {
    return this.adapter.markNotificationAsRead(id);
  }
}
