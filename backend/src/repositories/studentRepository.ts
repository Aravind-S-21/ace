import { getDatabaseAdapter } from '../db/adapters/adapterFactory';
import { IDatabaseAdapter } from '../db/adapters/databaseAdapter.interface';

export class StudentRepository {
  private get adapter(): IDatabaseAdapter {
    return getDatabaseAdapter();
  }

  public async findById(id: string | bigint): Promise<any | null> {
    return this.adapter.findStudentById(id);
  }

  public async findByUserId(userId: string | bigint): Promise<any | null> {
    return this.adapter.findStudentByUserId(userId);
  }

  public async createProfile(data: any): Promise<any> {
    return this.adapter.createStudentProfile(data);
  }

  public async updateProfile(id: string | bigint, data: any): Promise<any> {
    return this.adapter.updateStudentProfile(id, data);
  }
}
