import { IDatabaseAdapter } from './databaseAdapter.interface';
import { PrismaDatabaseAdapter } from './prismaAdapter';
import { InMemoryDatabaseAdapter } from './inMemoryAdapter';
import { env } from '../../config/env';

let instance: IDatabaseAdapter | null = null;

export function getDatabaseAdapter(): IDatabaseAdapter {
  if (!instance) {
    const mode = (process.env.DATABASE_ADAPTER || process.env.DB_MODE || env.DATABASE_ADAPTER).toLowerCase();
    if (mode === 'prisma') {
      try {
        instance = new PrismaDatabaseAdapter();
      } catch (err) {
        console.warn('Failed to initialize PrismaDatabaseAdapter, falling back to InMemoryDatabaseAdapter:', err);
        instance = new InMemoryDatabaseAdapter();
      }
    } else {
      instance = new InMemoryDatabaseAdapter();
    }
  }
  return instance;
}

export function setDatabaseAdapter(adapter: IDatabaseAdapter) {
  instance = adapter;
}
