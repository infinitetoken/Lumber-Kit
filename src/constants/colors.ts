import { LogLevel } from './logLevel'

/** Each log level's color: its label in the apps' log list, a level's heat on the heatmap, the CLI's level column. */
export const logLevelColors: Record<number, string> = {
  [LogLevel.Debug]: '#737373',
  [LogLevel.Info]: '#60A5FA',
  [LogLevel.Warn]: '#FBBF24',
  [LogLevel.Error]: '#F87171',
  [LogLevel.Fatal]: '#E879F9'
}

/** The accent until someone picks their own (their account's `color`): amber, the wordmark's and the icon's. */
export const DEFAULT_ACCENT = '#FBBF24'

/**
 * Colors for an app without one of its own, and for other people, picked by `nameColor`: Tailwind's 500s, roughly
 * evenly spaced around the wheel, vivid and mid-light enough to read on dark and light surfaces.
 */
export const APP_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E', '#14B8A6', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF', '#EC4899'] as const
