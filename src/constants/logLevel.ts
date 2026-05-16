// Source: D-01 (locked decision — do not change numeric values without a semver major bump)

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
