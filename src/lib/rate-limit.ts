/**
 * Escalating in-memory rate limiter for server actions.
 * Lockout duration doubles with each failed attempt, up to 48 hours max.
 * Works per-Vercel-serverless-instance (good enough for MVP).
 */

const store = new Map<
  string,
  { count: number; resetAt: number; level: number }
>();

// Clean up expired entries every 5 minutes
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store) {
    if (now > value.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

if (typeof cleanupInterval === "object" && cleanupInterval.unref) {
  cleanupInterval.unref();
}

const MAX_LOCKOUT_SECONDS = 48 * 60 * 60; // 48 hours

interface RateLimitConfig {
  key: string;
  maxAttempts: number;
  windowSeconds: number;
}

/**
 * Calculate lockout duration based on escalation level.
 * Level 1 = base window, each subsequent level doubles, capped at 48h.
 */
function getLockoutSeconds(baseWindow: number, level: number): number {
  const duration = baseWindow * Math.pow(2, level);
  return Math.min(duration, MAX_LOCKOUT_SECONDS);
}

/**
 * Check and increment rate limit with escalating lockouts.
 */
export function checkRateLimit({
  key,
  maxAttempts,
  windowSeconds,
}: RateLimitConfig): { success: true } | { success: false; retryAfter: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // Window expired or first attempt — start fresh at level 0
    store.set(key, { count: 1, resetAt: now + windowSeconds * 1000, level: 0 });
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
 * Called after a FAILED attempt to escalate the lockout level.
 * Doubles the window for the next lockout, capped at 48 hours.
 */
export function escalateLockout(key: string, baseWindow: number): void {
  const entry = store.get(key);
  if (!entry) return;

  const newLevel = entry.level + 1;
  const newDuration = getLockoutSeconds(baseWindow, newLevel);
  const now = Date.now();

  // Force lockout by setting count to max and extending resetAt
  store.set(key, {
    count: 999, // well above any maxAttempts
    resetAt: now + newDuration * 1000,
    level: newLevel,
  });
}

export function getRateLimitKey(action: string, identifier?: string): string {
  return identifier ? `${action}:${identifier}` : action;
}

export function getClientKey(action: string, email?: string): string {
  return email ? `${action}:${email}` : action;
}
