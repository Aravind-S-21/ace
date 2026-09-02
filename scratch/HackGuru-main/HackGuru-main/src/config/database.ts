import { PrismaClient } from '@prisma/client';

if (!(globalThis as any).__prismaInstance__) {
  (globalThis as any).__prismaInstance__ = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
}

export const getPrisma = (): PrismaClient => (globalThis as any).__prismaInstance__;

export const setMockPrisma = (mockClient: any) => {
  (globalThis as any).__prismaInstance__ = mockClient;
};

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});

export default prisma;
