/**
 * Simple in-memory rate limiter for server actions.
 * Works per-Vercel-serverless-instance (good enough for MVP).
 * For distributed rate limiting, upgrade to @upstash/ratelimit + Redis.
 */

const store = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries every 5 minutes
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store) {
    if (now > value.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

// Prevent memory leak in serverless
if (typeof cleanupInterval === "object" && cleanupInterval.unref) {
  cleanupInterval.unref();
}

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
 * Generate a rate limit key for a specific action.
 * Uses action name + user identifier when available.
 */
export function getRateLimitKey(action: string, identifier?: string): string {
  return identifier ? `${action}:${identifier}` : action;
}

/**
 * Get client IP from request headers.
 * In server actions we cannot access headers directly,
 * so we use a per-email key instead.
 */
export function getClientKey(action: string, email?: string): string {
  return email ? `${action}:${email}` : action;
}
