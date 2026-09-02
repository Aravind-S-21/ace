import { getDatabaseAdapter } from '../db/adapters/adapterFactory';
import { IDatabaseAdapter } from '../db/adapters/databaseAdapter.interface';

export class NotificationRepository {
  private get adapter(): IDatabaseAdapter {
    return getDatabaseAdapter();
  }

  public async getStudentNotifications(studentId: string | bigint, limit: number = 50): Promise<any[]> {
    return this.adapter.getStudentNotifications(studentId);
  }

  public async createNotification(data: any): Promise<any> {
    return this.adapter.createNotification(data);
  }

  public async markAsRead(id: string, studentId?: string | bigint): Promise<boolean> {
    const res = await this.adapter.markNotificationAsRead(id);
    return res.success || !!res;
  }
}
