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
