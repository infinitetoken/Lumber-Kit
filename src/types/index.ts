import { LogLevel, SubscriptionLevel } from '../constants'

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
 * payload = base64(ciphertext)
 * nonce = base64(random nonce/iv)
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
 * Wrapped application encryption key for a specific user.
 */
export interface AppEncryptedKey {
  userId: string
  encryptedKey: string
  keyVersion: number
}

/**
 * API response shape for a listed or fetched app.
 */
export interface AppRecord {
  id: string
  createdAt: string
  updatedAt: string

  name: string
  encryptedKeys?: AppEncryptedKey[]
}

/**
 * App creation response.
 * Initial wrapped encryption key may optionally be returned.
 */
export interface AppCreatedRecord extends AppRecord {
  apiKey?: string
}

/**
 * Machine authentication credential.
 */
export interface ApiKeyRecord {
  id: string
  createdAt: string
  updatedAt: string

  appId: string

  name?: string
}

/**
 * App membership / authorization.
 */
export interface MembershipRecord {
  id: string
  createdAt: string
  updatedAt: string

  appId: string
  userId: string

  role: 'owner' | 'admin' | 'read' | 'write'
}

export interface FcmToken {
  token: string
  deviceId?: string
  platform?: 'ios' | 'android' | 'web'
}

export interface NotificationPreference {
  enabled?: boolean
  minimumLevel?: number
}

export interface NotificationPreferences {
  enabled?: boolean
  minimumLevel?: number
  perApp?: Record<string, NotificationPreference>
}

/**
 * Public user profile returned from API.
 */
export interface UserRecord {
  id: string
  createdAt: string
  updatedAt: string

  email: string
  publicKey?: string
  subscriptionLevel: SubscriptionLevel
  agreedToTerms: boolean
  notificationPreferences: NotificationPreferences
  fcmTokens: FcmToken[]
}

/**
 * Filter params for GET /logs.
 */
export interface LogsQuery {
  appIds?: string[]
  levels?: LogLevel[]
  flagged?: boolean
  limit?: number
  cursor?: string
  sort?: string
  from?: string
  to?: string
}

/**
 * Filter params for GET /apps.
 */
export interface AppsQuery {
  limit?: number
  cursor?: string
  sort?: string
  from?: string
  to?: string
}
