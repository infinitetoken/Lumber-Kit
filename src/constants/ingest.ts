/** The Lumber API a plugin sends logs to unless it's given another endpoint. */
export const DEFAULT_API_ENDPOINT = 'https://api.lumber.infinitetoken.com'

/** LogEncrypted's keyVersion. Every app has one encryption key, so it's 1 until keys can be rotated. */
export const LOG_KEY_VERSION = 1

/**
 * How a plugin delivers logs: one POST /logs per log, in the order they were logged. A network error or a 5xx is a
 * failed attempt, tried again after `baseDelayMs`, doubling up to `maxDelayMs`, and dropped after `maxAttempts`. Any
 * other 4xx (a 413 for a log over MAX_LOG_PAYLOAD_LENGTH among them) is dropped at once, since sending it again won't
 * help. Any 2xx is sent, including the 200 the API answers when it drops a log below ERROR past the team's monthly
 * logs (monthlyLogsCap). A 429 (the team is at its hard stop, twice its plan's monthly logs) drops what's queued and
 * every new log until its Retry-After, or for `pauseMs` when it has none.
 */
export const logDelivery = {
  maxAttempts: 5,
  baseDelayMs: 1000,
  maxDelayMs: 30_000,
  pauseMs: 60 * 60 * 1000
} as const

/**
 * The longest `encrypted.payload` POST /logs takes, in characters: 16 KB of base64, about 12 KB of log as written (its
 * message, context and metadata). A longer one is refused with a 413, which a plugin drops at once with a warning
 * (Jay, 2026-11-13). The server can only measure the ciphertext.
 */
export const MAX_LOG_PAYLOAD_LENGTH = 16 * 1024
