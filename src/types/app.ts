import type { TeamMemberRecord } from './team'

/**
 * Wrapped application encryption key for a specific user.
 */
export interface AppEncryptedKey {
  userId: string
  encryptedKey: string
  keyVersion: number
}

/**
 * Who on an app's team can read it: everyone on the team, or only its owner. Its guests read it either way.
 */
export type AppTeamAccess = 'everyone' | 'owner'

/**
 * API response shape for a listed or fetched app.
 * encryptedKey is the requesting user's wrapped copy of the app key, or null if none exists.
 * The optional fields are missing from an API deployed before them, which clients read as the default.
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

  /** Missing means 'everyone'. */
  teamAccess?: AppTeamAccess
  /** How many days of its logs the app's team's plan keeps, null for no limit (and when missing). */
  retentionDays?: number | null
  /**
   * While the team has sent its plan's monthly logs, when every level is taken again (the next UTC month); else null.
   * Until then only ERROR and FATAL are taken (monthlyLogsCap).
   */
  logsCappedUntil?: string | null
  /**
   * While the team is at its hard stop (twice its plan's monthly logs, monthlyLogsCap), when any log is taken again
   * (the next UTC month); else null. Set only alongside logsCappedUntil.
   */
  logsStoppedUntil?: string | null
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
 * What someone may do on an app. manage: the team's owner or admins, or a guest invited as owner or admin. write: a
 * team member or a write guest. read: any other access.
 */
export type AppPermission = 'read' | 'write' | 'manage'

/**
 * Someone who can read an app, as the others see them (GET /apps/:id/people): never their email address.
 */
export interface AppPersonRecord {
  userId: string
  name: string | null
  /** The part of their email before the @, for anyone who hasn't set a name. */
  handle?: string | null
  color: string | null
  /** Their picture URL, or null for their initial. */
  imageUrl?: string | null
  role: TeamMemberRecord['role'] | GuestRecord['role']
  kind: 'team' | 'guest'
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
