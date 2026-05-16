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
 * Encrypted note content.
 * payload = base64(authTag + ciphertext)
 * nonce = base64(random IV)
 * keyVersion enables future key rotation.
 */
export interface NotePrivate {
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
  imageUrl?: string
  teamId?: string
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
 * An organization that owns apps and pays for member usage.
 * Team subscriptionLevel takes precedence over individual member levels.
 */
export interface TeamRecord {
  id: string
  createdAt: string
  updatedAt: string

  name: string
  color?: string
  imageUrl?: string
  subscriptionLevel: SubscriptionLevel
}

/**
 * Membership of a user in a team.
 */
export interface TeamMemberRecord {
  id: string
  createdAt: string
  updatedAt: string

  teamId: string
  userId: string

  role: 'owner' | 'admin' | 'member'
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
 * External guest granted access to a specific app without being a team member.
 */
export interface GuestRecord {
  id: string
  createdAt: string
  updatedAt: string

  appId: string
  userId: string

  role: 'owner' | 'admin' | 'read' | 'write'
}

/**
 * A short user-authored note, encrypted with the app key.
 * Visible to all members of the associated app.
 * Query by teamId in NotesQuery to build a cross-app team feed.
 */
export interface NoteRecord {
  id: string
  createdAt: string
  updatedAt: string

  appId: string
  userId: string

  private: NotePrivate
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
  imageUrl?: string
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

/**
 * Filter params for GET /teams.
 */
export interface TeamsQuery {
  limit?: number
  cursor?: string
  sort?: string
}

/**
 * Filter params for GET /notes.
 */
export interface NotesQuery {
  appId?: string
  teamId?: string
  userId?: string
  from?: string
  to?: string
  sort?: string
  limit?: number
  cursor?: string
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
