// Source: D-02, a locked decision: change a numeric value only with a semver major bump. Jay changed them on
// 2026-11-13: Hobby's monthly logs from 10,000 to 100,000 with push alerts on FATAL (it had none), and Dev's from
// 250,000 to 500,000. Pro and Enterprise, and every plan's retention, seats, apps, API keys and realtime, are unchanged.

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
  [SubscriptionLevel.Hobby]: { apps: 5, seats: 1, apiKeys: 1, logRetentionDays: 7, monthlyLogs: 100000, realtimeLogs: false, minPushLevel: LogLevel.Fatal },
  [SubscriptionLevel.Dev]: { apps: 10, seats: 5, apiKeys: 5, logRetentionDays: 30, monthlyLogs: 500000, realtimeLogs: true, minPushLevel: LogLevel.Error },
  [SubscriptionLevel.Pro]: { apps: 20, seats: 20, apiKeys: 15, logRetentionDays: 90, monthlyLogs: 2000000, realtimeLogs: true, minPushLevel: LogLevel.Warn },
  [SubscriptionLevel.Enterprise]: { apps: Infinity, seats: Infinity, apiKeys: Infinity, logRetentionDays: Infinity, monthlyLogs: Infinity, realtimeLogs: true, minPushLevel: LogLevel.Debug }
}

/**
 * What happens past a team's monthly logs (Jay, 2026-11-13: errors always get through). Past its plan's monthlyLogs,
 * POST /logs still takes ERROR and FATAL and drops lower levels, answering a dropped log 200 with `metadata.dropped`
 * so a plugin carries on, until `hardStopMultiple` times monthlyLogs, when it refuses every log with a 429 until the
 * next UTC month. Only the logs it takes count in usage, so the hard stop measures what every device holds.
 */
export const monthlyLogsCap = {
  /** The lowest level still taken past the cap. */
  minLevelPastCap: LogLevel.Error,
  /** Where every log is refused, as a multiple of the plan's monthlyLogs. */
  hardStopMultiple: 2
} as const

export type SubscriptionPlan = {
  /** Display name, as every surface shows it. */
  name: string
  /** Monthly price in US dollars: 0 for free, null when priced per customer. */
  monthlyPrice: number | null
}

/** Each level's name and price. Stripe holds the prices themselves; these must match what it charges. */
export const subscriptionPlans: Record<SubscriptionLevel, SubscriptionPlan> = {
  [SubscriptionLevel.Hobby]: { name: 'Hobby', monthlyPrice: 0 },
  [SubscriptionLevel.Dev]: { name: 'Dev', monthlyPrice: 9 },
  [SubscriptionLevel.Pro]: { name: 'Pro', monthlyPrice: 39 },
  [SubscriptionLevel.Enterprise]: { name: 'Enterprise', monthlyPrice: null }
}
