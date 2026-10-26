/**
 * In-memory token bucket rate limiter, keyed per client (IP).
 *
 * Peptides v2 rule: at most 10 assistant requests per minute per network
 * (no auth, so the client IP from the proxy headers is the key).
 *
 * Honest limit, documented in docs/PEPTIDES_V2_RESEARCH.md §7: a bucket
 * held only in memory is per server instance, so on serverless it is an
 * approximation, not a hard global cap. A shared server-side counter
 * (KV/Redis) would be needed to make it exact; that is deliberately
 * out of scope for this slice.
 */

export type RateLimitResult = {
  allowed: boolean;
  /** Whole tokens left in the bucket after this request (0 when denied). */
  remaining: number;
  /** Seconds to wait before at least one token is available (0 when allowed). */
  retryAfterSeconds: number;
};

export class TokenBucketLimiter {
  private readonly capacity: number;
  private readonly refillIntervalMs: number;
  private readonly buckets = new Map<string, { tokens: number; updatedAt: number }>();

  constructor(options: { capacity: number; refillIntervalMs: number }) {
    this.capacity = options.capacity;
    this.refillIntervalMs = options.refillIntervalMs;
  }

  consume(key: string, nowMs: number = Date.now()): RateLimitResult {
    const bucket = this.buckets.get(key) ?? { tokens: this.capacity, updatedAt: nowMs };
    const elapsed = Math.max(0, nowMs - bucket.updatedAt);
    const refilled = Math.min(this.capacity, bucket.tokens + elapsed / this.refillIntervalMs);
    bucket.tokens = refilled;
    bucket.updatedAt = nowMs;

    if (bucket.tokens < 1) {
      // Prune buckets idle for a while so the map cannot grow unboundedly.
      if (this.buckets.size > 500) {
        for (const [k, b] of this.buckets) {
          if (nowMs - b.updatedAt > 10 * 60 * 1000) this.buckets.delete(k);
        }
      }
      this.buckets.set(key, bucket);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.ceil(((1 - bucket.tokens) * this.refillIntervalMs) / 1000),
      };
    }

    bucket.tokens -= 1;
    this.buckets.set(key, bucket);
    return { allowed: true, remaining: Math.floor(bucket.tokens), retryAfterSeconds: 0 };
  }
}

/** Peptides v2 rule: 10 requests per minute, refilling 1 token every 6 seconds. */
export const assistantRateLimiter = new TokenBucketLimiter({ capacity: 10, refillIntervalMs: 6000 });

/** Client identity without auth: first entry of X-Forwarded-For, else X-Real-IP. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
