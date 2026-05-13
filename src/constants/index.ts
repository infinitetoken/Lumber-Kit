// Source: D-01, D-02 (locked decisions — do not change numeric values without a semver major bump)

/** Log severity level. Numeric values match the existing Lumber-API level field. */
export const enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  Fatal = 4
}

/** User subscription tier. Mirrors User.subscriptionLevel in Lumber-API. */
export const enum SubscriptionLevel {
  Hobby = 0,
  Dev = 1,
  Pro = 2
}
