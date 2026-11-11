export type Appearance = 'system' | 'dark' | 'light'

/** A 24-hour clock (`19:15:44`) or a 12-hour one (`7:15:44 PM`). */
export type TimeClock = '24h' | '12h'

/** The device's own time zone, or UTC. */
export type TimeZoneChoice = 'local' | 'utc'

/**
 * How a user reads times, on every device: the clock, and the zone that times, days and hours are in (the log list, the
 * heatmap, pushes).
 */
export interface TimeFormat {
  clock: TimeClock
  zone: TimeZoneChoice
}

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
  /** Whether new notes on this app push, over the account's `notes`; missing follows the account's. */
  notes?: boolean
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
  /** Null until the user picks one (DEFAULT_TIME_FORMAT). Missing from an API before it was kept. */
  timeFormat?: TimeFormat | null
  agreedToTermsVersion?: string
  notificationPreferences: NotificationPreferences
  pushTokens: PushToken[]

  /** When the address was confirmed, null until it is. Missing from an API before email confirmation. */
  emailVerifiedAt?: string | null
  /** Per app, when the user last had its notes open, from any device. Missing from an API before it was kept. */
  notesReadAt?: Record<string, string>
}
