import { LogLevel } from '../constants'

/**
 * Structured log context content.
 */
export interface LogContext {
  code?: string
  method?: string
  line?: number
  column?: number

  note?: string

  [key: string]: unknown
}

/**
 * Encrypted envelope stored on the server.
 * payload = base64(authTag + ciphertext)
 * nonce = base64(random IV)
 * keyVersion enables future rotation support.
 */
export interface LogEncrypted {
  nonce: string
  payload: string
  keyVersion: number
}

/**
 * Plaintext shape of log content: a plugin encrypts it into LogEncrypted, and the server never sees it.
 */
export interface LogPayload {
  level: LogLevel
  message: string
  requestId?: string
  traceId?: string
  context?: LogContext
  metadata?: Record<string, unknown>
}

/**
 * What a plugin's log call takes beside its message (Lumber-Node's second argument). requestId and traceId become the
 * payload's own fields, context is merged over the plugin's automatic context, and any other key goes into metadata,
 * where an explicit metadata key wins. A context or metadata that isn't an object is kept as an ordinary metadata key.
 */
export interface LogData {
  requestId?: string
  traceId?: string
  context?: LogContext
  metadata?: Record<string, unknown>
  [key: string]: unknown
}

/** POST /logs' body. The level stays plaintext for filtering and pushes; everything else is in `encrypted`. */
export interface LogIngestBody {
  level: LogLevel
  encrypted: LogEncrypted
}

/** What a plugin does with a log after POST /logs answers (see logDelivery). */
export type LogDeliveryOutcome = 'sent' | 'retry' | 'drop' | 'pause'

/**
 * API response shape for a stored log.
 * level is plaintext for server-side notification routing; all content is inside encrypted.
 */
export interface LogRecord {
  id: string
  createdAt: string
  updatedAt: string
  appId: string
  level: LogLevel
  encrypted: LogEncrypted
}

/**
 * Sync-protocol params for GET /logs.
 */
export interface LogsQuery {
  appIds?: string[]
  levels?: number[]
  from?: string
  to?: string
  sort?: string
  limit?: number
  cursor?: string
}
