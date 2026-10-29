export type Appearance = 'system' | 'dark' | 'light'

export interface PushToken {
  token: string
  deviceId?: string
  platform?: 'ios' | 'android' | 'web'
  /** The device's IANA time zone, so a push can say a log's time as the device would. */
  timeZone?: string
}

export interface NotificationPreference {
  enabled?: boolean
  minimumLevel?: number
  lastReadAt?: string
}

export interface NotificationPreferences {
  enabled?: boolean
  minimumLevel?: number
  /** Whether new notes on the user's apps push; on unless false. */
  notes?: boolean
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
  name?: string
  publicKey?: string
  appearance?: Appearance
  color?: string
  imageUrl?: string
  agreedToTermsVersion?: string
  notificationPreferences: NotificationPreferences
  pushTokens: PushToken[]

  /** When the address was confirmed, null until it is. Missing from an API before email confirmation. */
  emailVerifiedAt?: string | null
  /** Per app, when the user last had its notes open, from any device. Missing from an API before it was kept. */
  notesReadAt?: Record<string, string>
}
