import { LogLevel, logLevels, SubscriptionLevel, subscriptionLevels } from '../constants'
import { Appearance, DeviceLinkStatus } from '../types'

const appearanceValues: Appearance[] = ['system', 'dark', 'light']

export const isValidAppearance = (value: unknown): value is Appearance => appearanceValues.includes(value as Appearance)

/** Accepts 3- and 6-digit hex color strings (#rgb, #rrggbb). */
export const isValidColor = (value: string): boolean => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)

export const isValidLogLevel = (value: unknown): value is LogLevel => (logLevels as readonly unknown[]).includes(value)

export const isValidSubscriptionLevel = (value: unknown): value is SubscriptionLevel => (subscriptionLevels as readonly unknown[]).includes(value as number)

const deviceLinkStatuses: DeviceLinkStatus[] = ['pending', 'approved', 'denied']

export const isValidDeviceLinkStatus = (value: unknown): value is DeviceLinkStatus => deviceLinkStatuses.includes(value as DeviceLinkStatus)
