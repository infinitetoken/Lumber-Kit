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
 * public_key doubles as both the app identifier and the encryption recipient key.
 * private_key is intentionally absent — returned once in AppCreatedRecord and never again.
 * Source: D-06, ENCRYPT-02, ENCRYPT-03
 */
export interface AppRecord {
  id: string
  user_id: string
  name: string
  public_key: string
  created_at: string
  updated_at: string
}

/**
 * App creation response only (POST /apps 201).
 * Includes private_key once; subsequent GET /apps and GET /apps/:id responses use AppRecord.
 * Source: D-06, ENCRYPT-02
 */
export interface AppCreatedRecord extends AppRecord {
  private_key: string
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
