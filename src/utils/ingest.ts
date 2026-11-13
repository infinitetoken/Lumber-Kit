import { logDelivery, LogLevel } from '../constants'
import { LogData, LogDeliveryOutcome, LogPayload } from '../types'

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * The plaintext a plugin encrypts for one log call: its level and message, requestId and traceId when given, the
 * plugin's automatic context (pid, hostname and the like) with the call's context over it, and the call's other keys
 * as metadata with its explicit metadata over them. A context or metadata that isn't an object (a string, an array) is
 * kept as an ordinary metadata key, since spreading it would turn `{ context: 'billing' }` into `{ 0: 'b', ... }`, and
 * a null one is left out. Every plugin builds the same payload: contract/vectors.json pins it for the other languages.
 */
export const buildLogPayload = (level: LogLevel, message: string, data?: LogData, autoContext?: Record<string, unknown>): LogPayload => {
  const { requestId, traceId, context: givenContext, metadata: givenMetadata, ...rest } = data ?? {}

  const context = isRecord(givenContext) ? givenContext : undefined
  const metadata = isRecord(givenMetadata) ? givenMetadata : undefined
  if (givenContext != null && !context) rest.context = givenContext
  if (givenMetadata != null && !metadata) rest.metadata = givenMetadata

  const mergedMetadata = Object.keys(rest).length > 0 ? { ...rest, ...(metadata ?? {}) } : metadata
  const mergedContext = autoContext && Object.keys(autoContext).length > 0 ? { ...autoContext, ...(context ?? {}) } : context

  const payload: LogPayload = { level, message }
  if (requestId !== undefined) payload.requestId = requestId
  if (traceId !== undefined) payload.traceId = traceId
  if (mergedContext !== undefined) payload.context = mergedContext
  if (mergedMetadata !== undefined) payload.metadata = mergedMetadata
  return payload
}

/**
 * What to do with a log once POST /logs answers with `status`, or null for no answer (a network error): sent on a 2xx
 * (the API's 200 for a log it dropped past the monthly cap too), pause on a 429, drop on any other 4xx, and retry on
 * anything else.
 */
export const logDeliveryOutcome = (status: number | null): LogDeliveryOutcome => {
  if (status === null) return 'retry'
  if (status >= 200 && status < 300) return 'sent'
  if (status === 429) return 'pause'
  if (status >= 400 && status < 500) return 'drop'
  return 'retry'
}

/** How long to wait before trying a log again after its `failedAttempts`th failure: 1s, 2s, 4s and so on, up to 30s. */
export const logRetryDelayMs = (failedAttempts: number): number => Math.min(logDelivery.baseDelayMs * 2 ** Math.max(0, failedAttempts - 1), logDelivery.maxDelayMs)
