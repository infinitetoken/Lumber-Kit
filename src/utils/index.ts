export * from './ingest'

import { type ApiErrorCode, apiErrorCodes, APP_COLORS, DEFAULT_PUSH_THRESHOLD, LogLevel, logLevels, PUSH_OFF, type PushThreshold, SubscriptionLevel, subscriptionLevels } from '../constants'
import { Appearance, DeviceLinkStatus, PushData, TeamMemberRecord } from '../types'

const appearanceValues: Appearance[] = ['system', 'dark', 'light']

export const isValidAppearance = (value: unknown): value is Appearance => appearanceValues.includes(value as Appearance)

/** Accepts 3- and 6-digit hex color strings (#rgb, #rrggbb). */
export const isValidColor = (value: string): boolean => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)

// FNV-1a: a fast, well-spread string hash, so similar names still land on different colors
const hashName = (name: string): number => {
  let hash = 0x811c9dc5
  for (const char of name.trim().toLowerCase()) {
    hash ^= char.codePointAt(0) ?? 0
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/**
 * One of APP_COLORS for a name, ignoring case and surrounding spaces. Nothing is stored: every device works out the
 * same color.
 */
export const nameColor = (name: string): string => APP_COLORS[hashName(name) % APP_COLORS.length]

/** An app's color: the one its owner picked, or its name's. */
export const resolveAppColor = (name: string, color?: string | null): string => (color && isValidColor(color) ? color : nameColor(name))

/** Someone else's color, from their user id, since their own accent lives on their account. */
export const personColor = (userId: string): string => nameColor(userId)

export const isValidLogLevel = (value: unknown): value is LogLevel => (logLevels as readonly unknown[]).includes(value)

export const isValidSubscriptionLevel = (value: unknown): value is SubscriptionLevel => (subscriptionLevels as readonly unknown[]).includes(value as number)

const deviceLinkStatuses: DeviceLinkStatus[] = ['pending', 'approved', 'denied', 'failed']

export const isValidDeviceLinkStatus = (value: unknown): value is DeviceLinkStatus => deviceLinkStatuses.includes(value as DeviceLinkStatus)

const teamMemberRoles: TeamMemberRecord['role'][] = ['owner', 'admin', 'member']

export const isValidTeamMemberRole = (value: unknown): value is TeamMemberRecord['role'] => teamMemberRoles.includes(value as TeamMemberRecord['role'])

/** Accepts any valid absolute URL (https://..., http://..., etc.). */
export const isValidImageUrl = (value: unknown): value is string => {
  if (typeof value !== 'string' || value.length === 0) return false
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

/**
 * The API key the Lumber app hands out: an app's API token and its encryption key, joined as `<token>.<encryptionKey>`,
 * so a plugin is configured with one secret. A plugin sends only the token to the API (`Authorization: Bearer <token>`)
 * and encrypts with the rest, so the encryption key never leaves it. Neither half can contain a `.` (hex and base64).
 */
export const joinApiKey = (token: string, encryptionKey: string): string => `${token}.${encryptionKey}`

/** Splits an API key into its token and encryption key. A value with no dot is all token. */
export const splitApiKey = (apiKey: string): { token: string; encryptionKey?: string } => {
  const value = apiKey.trim()
  const dot = value.indexOf('.')
  if (dot === -1) return { token: value }
  return { token: value.slice(0, dot), encryptionKey: value.slice(dot + 1) }
}

/**
 * A push threshold from a stored or sent preference: a log level, or PUSH_OFF for anything past Fatal. Below Debug is
 * Debug, a fraction rounds, and anything that isn't a finite number is the default (Warn).
 */
export const normalizePushThreshold = (value: unknown): PushThreshold => {
  const level = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN
  if (!Number.isFinite(level)) return DEFAULT_PUSH_THRESHOLD
  if (level > LogLevel.Fatal) return PUSH_OFF
  if (level <= LogLevel.Debug) return LogLevel.Debug
  return Math.round(level) as PushThreshold
}

export const isApiErrorCode = (value: unknown): value is ApiErrorCode => (apiErrorCodes as readonly unknown[]).includes(value)

/** The code in an API error response's body, or null when it has none. */
export const apiErrorCodeOf = (body: unknown): ApiErrorCode | null => {
  const code = body && typeof body === 'object' ? (body as { code?: unknown }).code : undefined
  return isApiErrorCode(code) ? code : null
}

const isId = (value: unknown): value is string => typeof value === 'string' && value.length > 0

/** A push notification's data as PushData, or null for data no Lumber push sends. */
export const parsePushData = (data: unknown): PushData | null => {
  if (!data || typeof data !== 'object') return null
  const d = data as Record<string, unknown>
  switch (d.type) {
    case 'log':
      return isId(d.appId) && isId(d.logId) ? { type: 'log', appId: d.appId, logId: d.logId, level: String(d.level ?? '') } : null
    case 'note':
      return isId(d.appId) && isId(d.noteId) ? { type: 'note', appId: d.appId, noteId: d.noteId } : null
    case 'device_link':
    case 'device_link_answered':
      return isId(d.deviceLinkId) ? { type: d.type, deviceLinkId: d.deviceLinkId, deviceName: typeof d.deviceName === 'string' ? d.deviceName : '' } : null
    case 'key_check':
      return isId(d.checkId) ? { type: 'key_check', checkId: d.checkId } : null
    case 'key_waiting':
      return isId(d.userId) ? { type: 'key_waiting', userId: d.userId } : null
    case 'keys_shared':
      return isId(d.appId) ? { type: 'keys_shared', appId: d.appId } : { type: 'keys_shared' }
    default:
      return null
  }
}
