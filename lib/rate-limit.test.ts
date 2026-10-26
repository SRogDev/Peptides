import { describe, expect, it } from "vitest";
import { getClientIp, TokenBucketLimiter } from "./rate-limit";

describe("token bucket rate limiter (10 requests per minute)", () => {
  it("allows the first 10 requests from one key, then denies the 11th", () => {
    const limiter = new TokenBucketLimiter({ capacity: 10, refillIntervalMs: 6000 });
    for (let i = 0; i < 10; i++) {
      const result = limiter.consume("203.0.113.1", 0);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9 - i);
    }
    const denied = limiter.consume("203.0.113.1", 0);
    expect(denied.allowed).toBe(false);
    expect(denied.remaining).toBe(0);
    expect(denied.retryAfterSeconds).toBe(6);
  });

  it("refills one token every 6 seconds", () => {
    const limiter = new TokenBucketLimiter({ capacity: 10, refillIntervalMs: 6000 });
    for (let i = 0; i < 10; i++) limiter.consume("203.0.113.1", 0);
    expect(limiter.consume("203.0.113.1", 0).allowed).toBe(false);
    expect(limiter.consume("203.0.113.1", 6000).allowed).toBe(true);
    expect(limiter.consume("203.0.113.1", 6000).allowed).toBe(false);
  });

  it("is full again after a minute of idle time", () => {
    const limiter = new TokenBucketLimiter({ capacity: 10, refillIntervalMs: 6000 });
    for (let i = 0; i < 10; i++) limiter.consume("203.0.113.1", 0);
    for (let i = 0; i < 10; i++) {
      expect(limiter.consume("203.0.113.1", 60000).allowed).toBe(true);
    }
    expect(limiter.consume("203.0.113.1", 60000).allowed).toBe(false);
  });

  it("tracks keys independently", () => {
    const limiter = new TokenBucketLimiter({ capacity: 10, refillIntervalMs: 6000 });
    for (let i = 0; i < 10; i++) limiter.consume("203.0.113.1", 0);
    expect(limiter.consume("203.0.113.1", 0).allowed).toBe(false);
    expect(limiter.consume("198.51.100.2", 0).allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("takes the first X-Forwarded-For entry", () => {
    const req = new Request("http://localhost/api/assistant", {
      headers: { "x-forwarded-for": "203.0.113.1, 70.41.3.2" },
    });
    expect(getClientIp(req)).toBe("203.0.113.1");
  });

  it("falls back to X-Real-IP, then to unknown", () => {
    expect(getClientIp(new Request("http://localhost/", { headers: { "x-real-ip": "198.51.100.2" } }))).toBe("198.51.100.2");
    expect(getClientIp(new Request("http://localhost/"))).toBe("unknown");
  });
});
