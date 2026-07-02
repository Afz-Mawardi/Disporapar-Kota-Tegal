import { PrismaClient } from '@prisma/client';
import net from 'net';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  dbOffline?: boolean;
  lastChecked?: number;
};

export const prisma =
  (globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error']
  })) as PrismaClient & { [key: string]: any };

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

function checkPort(host: string, port: number, timeout = 500): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port, timeout });
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('error', () => {
      resolve(false);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

export async function checkDatabaseConnection(): Promise<boolean> {
  const now = Date.now();
  // Cache connection status for 5 seconds to avoid port check on every parallel query
  if (globalForPrisma.lastChecked !== undefined && (now - globalForPrisma.lastChecked < 5000)) {
    return !globalForPrisma.dbOffline;
  }

  let host = 'localhost';
  let port = 3306;

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const match = dbUrl.match(/@([^:/]+)(?::(\d+))?/);
      if (match) {
        host = match[1];
        if (match[2]) {
          port = parseInt(match[2], 10);
        }
      }
    } catch (e) {
      // fallback
    }
  }

  const isOnline = await checkPort(host, port, 500);
  globalForPrisma.dbOffline = !isOnline;
  globalForPrisma.lastChecked = now;
  return isOnline;
}

