import { LogLevel } from '../constants'

/**
 * Structured log context content.
 */
export interface LogContext {
  requestId?: string
  traceId?: string

  code?: string
  method?: string
  line?: number
  column?: number

  note?: string

  [key: string]: unknown
}

/**
 * Encrypted private container.
 * payload = base64(authTag + ciphertext)
 * nonce = base64(random IV)
 * keyVersion enables future rotation support.
 */
export interface LogPrivate {
  payload: string
  nonce: string
  keyVersion: number
}

/**
 * API response shape for a stored log.
 */
export interface LogRecord {
  id: string
  createdAt: string
  updatedAt: string

  appId: string
  requestId?: string
  traceId?: string

  level: LogLevel
  message: string

  flagged: boolean

  context?: LogContext
  metadata?: Record<string, unknown>

  private?: LogPrivate
}

/**
 * Filter params for GET /logs.
 */
export interface LogsQuery {
  appIds?: string[]
  levels?: LogLevel[]
  text?: string
  flagged?: boolean
  from?: string
  to?: string
  sort?: string
  limit?: number
  cursor?: string
}
