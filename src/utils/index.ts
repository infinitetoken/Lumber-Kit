import { LogLevel, logLevels, SubscriptionLevel, subscriptionLevels } from '../constants'
import { Appearance, DeviceLinkStatus, TeamMemberRecord } from '../types'

const appearanceValues: Appearance[] = ['system', 'dark', 'light']

export const isValidAppearance = (value: unknown): value is Appearance => appearanceValues.includes(value as Appearance)

/** Accepts 3- and 6-digit hex color strings (#rgb, #rrggbb). */
export const isValidColor = (value: string): boolean => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)

export const isValidLogLevel = (value: unknown): value is LogLevel => (logLevels as readonly unknown[]).includes(value)

export const isValidSubscriptionLevel = (value: unknown): value is SubscriptionLevel => (subscriptionLevels as readonly unknown[]).includes(value as number)

const deviceLinkStatuses: DeviceLinkStatus[] = ['pending', 'approved', 'denied']

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
