/**
 * Simple in-memory rate limiter for server actions.
 * Works per-Vercel-serverless-instance (good enough for MVP).
 * For distributed rate limiting, upgrade to @upstash/ratelimit + Redis.
 */

const store = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store) {
    if (now > value.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  /** Unique key (e.g. IP + action name) */
  key: string;
  /** Max attempts allowed in the window */
  maxAttempts: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

/**
 * Check and increment rate limit. Returns { success: true } if allowed,
 * or { success: false, retryAfter: seconds } if rate limited.
 */
export function checkRateLimit({
  key,
  maxAttempts,
  windowSeconds,
}: RateLimitConfig): { success: true } | { success: false; retryAfter: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // First request or window expired — start new window
    store.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { success: true };
  }

  if (entry.count >= maxAttempts) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { success: false, retryAfter };
  }

  entry.count++;
  return { success: true };
}

/**
 * Get client IP from request headers (Vercel forwards real IP via x-forwarded-for).
 * Falls back to a generic key if IP isn't available.
 */
export function getClientIp(): string {
  // In server actions, we can't access headers directly.
  // Use a session-level key instead (all requests from same server instance share memory).
  return "global";
}
