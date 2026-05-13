import { LogLevel, SubscriptionLevel } from '../constants'

/**
 * Plaintext log fields before encryption.
 * Lumber-Node and Lumber-Python serialize this object, then encrypt it
 * into EncryptedPayload.payload using AES-256-GCM.
 */
export interface LogPayload {
  message?: string
  code?: string
  line?: number
  column?: number
  method?: string
  note?: string
}

/**
 * Encrypted wire format (v2 — ECIES).
 * payload = base64(eph_pub[32] + IV[12] + AuthTag[16] + ciphertext)
 * v = wire format version — always 2 in v2. Changes here are semver major.
 */
export interface EncryptedPayload {
  payload: string
  v: number
}

/**
 * API response shape for a stored log.
 * payload is the ciphertext — level and flagged are stored unencrypted for server-side filtering.
 * context and metadata are stored unencrypted alongside the payload.
 * Source: D-06, ENCRYPT-05, ENCRYPT-06
 */
export interface LogRecord {
  id: string
  appId: string
  level: LogLevel
  flagged: boolean
  payload: string
  context?: Record<string, unknown>
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/**
 * API response shape for a listed or fetched app.
 * publicKey doubles as both the app identifier and the encryption recipient key.
 * privateKey is intentionally absent — returned once in AppCreatedRecord and never again.
 * Source: D-06, ENCRYPT-02, ENCRYPT-03
 */
export interface AppRecord {
  id: string
  userId: string
  name: string
  publicKey: string
  createdAt: string
  updatedAt: string
}

/**
 * App creation response (POST /apps 201).
 * Same shape as AppRecord — no secrets returned, key pair is generated on-device.
 * Source: D-06, ENCRYPT-02
 */
export type AppCreatedRecord = AppRecord

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
 * API response shape for an authenticated user.
 * passwordDigest is intentionally absent.
 */
export interface UserRecord {
  id: string
  email: string
  subscriptionLevel: SubscriptionLevel
  agreedToTerms: boolean
  notificationPreferences: NotificationPreferences
  fcmTokens: FcmToken[]
  createdAt: string
  updatedAt: string
}

/**
 * Filter params for GET /logs.
 * Source: D-06
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
 * Source: D-06
 */
export interface AppsQuery {
  limit?: number
  cursor?: string
  sort?: string
  from?: string
  to?: string
}
