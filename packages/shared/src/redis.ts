// ─── Synapse Redis Connection Factory ───

import Redis from "ioredis";

let redisInstance: Redis | null = null;

export function getRedisConnection(): Redis {
  if (!redisInstance) {
    const url = process.env.REDIS_URL || "redis://localhost:6399";
    redisInstance = new Redis(url, {
      maxRetriesPerRequest: null, // Required for BullMQ
      enableReadyCheck: false,
      retryStrategy(times: number) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
  }
  return redisInstance;
}

export function createRedisConnection(): Redis {
  const url = process.env.REDIS_URL || "redis://localhost:6399";
  return new Redis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times: number) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });
}
