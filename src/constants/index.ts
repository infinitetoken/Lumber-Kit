// Source: D-01, D-02 (locked decisions — do not change numeric values without a semver major bump)

/** Log severity level. Numeric values match the existing Lumber-API level field. */
export const enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  Fatal = 4
}

/** String name for each log level. */
export type LogLevelName = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

/** Maps numeric log level to its lowercase string name. */
export const logLevelToName: Record<number, LogLevelName> = {
  [LogLevel.Debug]: 'debug',
  [LogLevel.Info]: 'info',
  [LogLevel.Warn]: 'warn',
  [LogLevel.Error]: 'error',
  [LogLevel.Fatal]: 'fatal'
}

/** Maps lowercase log level name to its numeric value. */
export const logLevelNameToLevel: Record<LogLevelName, LogLevel> = {
  debug: LogLevel.Debug,
  info: LogLevel.Info,
  warn: LogLevel.Warn,
  error: LogLevel.Error,
  fatal: LogLevel.Fatal
}

/** All valid log levels, ordered from least to most severe. */
export const logLevels: readonly LogLevel[] = [LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error, LogLevel.Fatal]

/** User subscription level. Mirrors User.subscriptionLevel in Lumber-API. */
export const enum SubscriptionLevel {
  Hobby = 0,
  Dev = 1,
  Pro = 2,
  Enterprise = 3
}

/** String name for each subscription level, suitable for display and Redux state. */
export type SubscriptionLevelName = 'hobby' | 'dev' | 'pro' | 'enterprise'

/** Maps numeric subscription level to its string level name. */
export const subscriptionLevelToName: Record<SubscriptionLevel, SubscriptionLevelName> = {
  [SubscriptionLevel.Hobby]: 'hobby',
  [SubscriptionLevel.Dev]: 'dev',
  [SubscriptionLevel.Pro]: 'pro',
  [SubscriptionLevel.Enterprise]: 'enterprise'
}

/** All valid subscription levels, ordered from least to most severe. */
export const subscriptionLevels: readonly SubscriptionLevel[] = [SubscriptionLevel.Hobby, SubscriptionLevel.Dev, SubscriptionLevel.Pro, SubscriptionLevel.Enterprise]

export type SubscriptionLimits = {
  apps: number
  memberships: number
  apiKeys: number
  logRetentionDays: number
  monthlyLogs: number
  /** Whether real-time WebSocket log streaming is available. */
  realtimeLogs: boolean
  /** Minimum log level that triggers a push notification. Infinity means push is disabled. */
  minPushLevel: number
}

/** Per-level resource limits. Use Infinity to mean unlimited or disabled. */
export const subscriptionLimits: Record<SubscriptionLevel, SubscriptionLimits> = {
  [SubscriptionLevel.Hobby]: { apps: 1, memberships: 1, apiKeys: 1, logRetentionDays: 7, monthlyLogs: 10000, realtimeLogs: false, minPushLevel: Infinity },
  [SubscriptionLevel.Dev]: { apps: 5, memberships: 5, apiKeys: 10, logRetentionDays: 30, monthlyLogs: 250000, realtimeLogs: true, minPushLevel: LogLevel.Error },
  [SubscriptionLevel.Pro]: { apps: 15, memberships: 15, apiKeys: 30, logRetentionDays: 90, monthlyLogs: 2000000, realtimeLogs: true, minPushLevel: LogLevel.Warn },
  [SubscriptionLevel.Enterprise]: { apps: Infinity, memberships: Infinity, apiKeys: Infinity, logRetentionDays: Infinity, monthlyLogs: Infinity, realtimeLogs: true, minPushLevel: LogLevel.Debug }
}
