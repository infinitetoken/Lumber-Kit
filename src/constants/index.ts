// Source: D-01, D-02 (locked decisions — do not change numeric values without a semver major bump)

/** Log severity level. Numeric values match the existing Lumber-API level field. */
export const enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  Fatal = 4
}

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
export const levelToName: Record<SubscriptionLevel, SubscriptionLevelName> = {
  [SubscriptionLevel.Hobby]: 'hobby',
  [SubscriptionLevel.Dev]: 'dev',
  [SubscriptionLevel.Pro]: 'pro',
  [SubscriptionLevel.Enterprise]: 'enterprise'
}
export type SubscriptionLimits = {
  apps: number
  memberships: number
  apiKeys: number
  logRetentionDays: number
  monthlyLogs: number
}

/** Per-level resource limits. Use Infinity to mean unlimited. */
export const subscriptionLimits: Record<SubscriptionLevel, SubscriptionLimits> = {
  [SubscriptionLevel.Hobby]: { apps: 1, memberships: 1, apiKeys: 1, logRetentionDays: 7, monthlyLogs: 10000 },
  [SubscriptionLevel.Dev]: { apps: 5, memberships: 5, apiKeys: 10, logRetentionDays: 30, monthlyLogs: 250000 },
  [SubscriptionLevel.Pro]: { apps: 15, memberships: 15, apiKeys: 30, logRetentionDays: 90, monthlyLogs: 2000000 },
  [SubscriptionLevel.Enterprise]: { apps: Infinity, memberships: Infinity, apiKeys: Infinity, logRetentionDays: Infinity, monthlyLogs: Infinity }
}
