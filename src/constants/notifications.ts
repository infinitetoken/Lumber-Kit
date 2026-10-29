import { LogLevel } from './logLevel'

/** A push threshold one past Fatal, which no log reaches: log pushes are off (the account's, or one app's). */
export const PUSH_OFF = 5

/** The lowest log level that pushes, or PUSH_OFF. Stored as a notification preference's `minimumLevel`. */
export type PushThreshold = LogLevel | typeof PUSH_OFF

/** The threshold a user gets when none is set. */
export const DEFAULT_PUSH_THRESHOLD: PushThreshold = LogLevel.Warn
