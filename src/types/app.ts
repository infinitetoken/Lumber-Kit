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
 * Filter params for GET /apps.
 */
export interface AppsQuery {
  teamId?: string

  from?: string
  to?: string
  sort?: string
  limit?: number
  cursor?: string
}
