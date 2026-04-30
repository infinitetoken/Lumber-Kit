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
 * Encrypted wire format.
 * payload = base64(IV[12 bytes] + AuthTag[16 bytes] + ciphertext)
 * v = wire format version — always 1 in v1. Changes here are semver major.
 */
export interface EncryptedPayload {
  payload: string
  v: number
}

/**
 * API response shape for a stored log.
 * payload is the ciphertext — level and flagged are stored unencrypted for server-side filtering.
 * Source: D-06, ENCRYPT-05, ENCRYPT-06
 */
export interface LogRecord {
  id: string
  app_id: string
  level: LogLevel
  flagged: boolean
  payload: string
  created_at: string
  updated_at: string
}

/**
 * API response shape for a listed or fetched app.
 * encryption_key is intentionally absent — it is returned once (in AppCreatedRecord) and never again.
 * Source: D-06, ENCRYPT-02, ENCRYPT-03
 */
export interface AppRecord {
  id: string
  user_id: string
  name: string
  token: string
  created_at: string
  updated_at: string
}

/**
 * App creation response only (POST /apps 201).
 * Includes encryption_key once; subsequent GET /apps and GET /apps/:id responses use AppRecord.
 * Source: D-06, ENCRYPT-02
 */
export interface AppCreatedRecord extends AppRecord {
  encryption_key: string
}

/**
 * API response shape for an authenticated user.
 * password_digest is intentionally absent.
 */
export interface UserRecord {
  id: string
  email: string
  subscription_level: SubscriptionLevel
  agreed_to_terms: boolean
  created_at: string
  updated_at: string
}

/**
 * Filter params for GET /logs.
 * Source: D-06
 */
export interface LogQuery {
  level?: LogLevel
  flagged?: boolean
  limit?: number
  offset?: number
  sort?: string
  from?: string
  to?: string
}

/**
 * Filter params for GET /apps.
 * Source: D-06
 */
export interface AppQuery {
  limit?: number
  offset?: number
  sort?: string
}
