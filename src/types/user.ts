export type Appearance = 'system' | 'dark' | 'light'

export interface PushToken {
  token: string
  deviceId?: string
  platform?: 'ios' | 'android' | 'web'
}

export interface NotificationPreference {
  enabled?: boolean
  minimumLevel?: number
  lastReadAt?: string
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
  name?: string
  publicKey?: string
  appearance?: Appearance
  color?: string
  imageUrl?: string
  agreedToTermsVersion?: string
  notificationPreferences: NotificationPreferences
  pushTokens: PushToken[]
}
