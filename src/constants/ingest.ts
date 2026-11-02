/** The Lumber API a plugin sends logs to unless it's given another endpoint. */
export const DEFAULT_API_ENDPOINT = 'https://api.lumber.infinitetoken.com'

/** LogEncrypted's keyVersion. Every app has one encryption key, so it's 1 until keys can be rotated. */
export const LOG_KEY_VERSION = 1

/**
 * How a plugin delivers logs: one POST /logs per log, in the order they were logged. A network error or a 5xx is a
 * failed attempt, tried again after `baseDelayMs`, doubling up to `maxDelayMs`, and dropped after `maxAttempts`. Any
 * other 4xx is dropped at once, since sending it again won't help. A 429 (the team's logs for the month are used up)
 * drops what's queued and every new log until its Retry-After, or for `pauseMs` when it has none.
 */
export const logDelivery = {
  maxAttempts: 5,
  baseDelayMs: 1000,
  maxDelayMs: 30_000,
  pauseMs: 60 * 60 * 1000
} as const
