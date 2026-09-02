import { AdapterFactory } from '../adapters/adapterFactory';
import { IDatabaseAdapter } from '../adapters/databaseAdapter.interface';

export class UserRepository {
  private get adapter(): IDatabaseAdapter {
    return AdapterFactory.getAdapter();
  }

  public async findByEmail(email: string): Promise<any | null> {
    return this.adapter.findUserByEmail(email);
  }

  public async findById(id: string | bigint): Promise<any | null> {
    return this.adapter.findUserById(id);
  }

  public async createUser(data: {
    email: string;
    fullName?: string;
    department?: string;
    college?: string;
    passwordHash?: string;
    role?: any;
  }): Promise<any> {
    return this.adapter.createUser(data);
  }
}
