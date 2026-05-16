import { LogLevel, SubscriptionLevel } from '../constants'

export type Appearance = 'system' | 'dark' | 'light'

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
 * Wrapped application encryption key for a specific user.
 */
export interface AppEncryptedKey {
  userId: string
  encryptedKey: string
  keyVersion: number
}

/**
 * API response shape for a listed or fetched app.
 * encryptedKey is the requesting user's wrapped copy of the app key, or null if none exists.
 */
export interface AppRecord {
  id: string
  createdAt: string
  updatedAt: string

  name: string
  color?: string
  logoUrl?: string
  encryptedKey: string | null
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

export interface PushToken {
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
  appearance?: Appearance
  color?: string
  subscriptionLevel: SubscriptionLevel
  agreedToTermsVersion?: string
  notificationPreferences: NotificationPreferences
  pushTokens: PushToken[]
}

export interface ResponseMetadata {
  requestId: string
  durationMs: number
  warnings?: string[]
  cursor?: string | null
  hasMore?: boolean
  count?: number
  hiddenCount?: number
}

export interface ApiResponse<T> {
  data: T
  metadata: ResponseMetadata
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

export type DeviceLinkStatus = 'pending' | 'approved' | 'denied'

/**
 * Response from POST /device-links.
 */
export interface DeviceLinkCreatedRecord {
  id: string
  expiresAt: string
}

/**
 * Response from GET /device-links/:id.
 * encryptedKey is present only when status is 'approved'.
 */
export interface DeviceLinkRecord {
  id: string
  status: DeviceLinkStatus
  encryptedKey?: string
  expiresAt: string
}
