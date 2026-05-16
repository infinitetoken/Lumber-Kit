// Source: D-02 (locked decision — do not change numeric values without a semver major bump)

import { LogLevel } from './logLevel'

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
  seats: number
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
  [SubscriptionLevel.Hobby]: { apps: 5, seats: 1, apiKeys: 1, logRetentionDays: 7, monthlyLogs: 10000, realtimeLogs: false, minPushLevel: Infinity },
  [SubscriptionLevel.Dev]: { apps: 10, seats: 5, apiKeys: 5, logRetentionDays: 30, monthlyLogs: 250000, realtimeLogs: true, minPushLevel: LogLevel.Error },
  [SubscriptionLevel.Pro]: { apps: 20, seats: 20, apiKeys: 15, logRetentionDays: 90, monthlyLogs: 2000000, realtimeLogs: true, minPushLevel: LogLevel.Warn },
  [SubscriptionLevel.Enterprise]: { apps: Infinity, seats: Infinity, apiKeys: Infinity, logRetentionDays: Infinity, monthlyLogs: Infinity, realtimeLogs: true, minPushLevel: LogLevel.Debug }
}
