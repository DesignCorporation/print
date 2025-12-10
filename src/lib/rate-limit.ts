import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null;

export const loginLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
    })
  : null;

export const apiLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
    })
  : null;

export async function checkLimit(limiter: Ratelimit | null, identifier: string) {
  if (!limiter) return { success: true };
  const result = await limiter.limit(identifier);
  return { success: result.success };
}
