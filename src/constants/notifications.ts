import type { TimeFormat } from '../types'
import { LogLevel } from './logLevel'

/** A push threshold one past Fatal, which no log reaches: log pushes are off (the account's, or one app's). */
export const PUSH_OFF = 5

/** The lowest log level that pushes, or PUSH_OFF. Stored as a notification preference's `minimumLevel`. */
export type PushThreshold = LogLevel | typeof PUSH_OFF

/** The threshold a user gets when none is set. */
export const DEFAULT_PUSH_THRESHOLD: PushThreshold = LogLevel.Warn

/** The time format a user gets until they pick one: 24-hour, in the device's own time zone. */
export const DEFAULT_TIME_FORMAT: TimeFormat = { clock: '24h', zone: 'local' }
