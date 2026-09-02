import { IDatabaseAdapter } from './databaseAdapter.interface';
import { PrismaDatabaseAdapter } from './prismaAdapter';
import { InMemoryDatabaseAdapter } from './inMemoryAdapter';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export class AdapterFactory {
  private static instance: IDatabaseAdapter | null = null;

  public static getAdapter(): IDatabaseAdapter {
    if (!this.instance) {
      const mode = (env.DATABASE_ADAPTER || 'inmemory').toLowerCase();
      if (mode === 'prisma') {
        logger.info('[AdapterFactory] Selected PrismaDatabaseAdapter (PostgreSQL)');
        this.instance = new PrismaDatabaseAdapter();
      } else {
        logger.info('[AdapterFactory] Selected InMemoryDatabaseAdapter (Local / Contract Mode)');
        this.instance = new InMemoryDatabaseAdapter();
      }
    }
    return this.instance;
  }

  public static setAdapter(adapter: IDatabaseAdapter): void {
    this.instance = adapter;
  }

  public static resetAdapter(): void {
    this.instance = null;
  }
}
