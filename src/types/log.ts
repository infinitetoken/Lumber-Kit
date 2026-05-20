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
 * Plaintext shape of log content — encrypted before sending, never stored plaintext on server.
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
