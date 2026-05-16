/**
 * A single time bucket in a timeseries response.
 * date is an ISO date string (YYYY-MM-DD for 'day', ISO datetime for 'hour').
 * byLevel optionally breaks down the count per LogLevel for severity-tinted rendering.
 */
export interface TimeseriesBucket {
  date: string
  count: number
  byLevel?: Partial<Record<number, number>>
}

/**
 * Generic timeseries aggregate response. Reusable across logs, notifications, messages, etc.
 */
export interface TimeseriesResponse {
  buckets: TimeseriesBucket[]
  from: string
  to: string
  interval: 'day' | 'hour'
}

/**
 * Filter params for GET /logs/timeseries.
 */
export interface LogTimeseriesQuery {
  appIds?: string[]
  levels?: number[]
  from?: string
  to?: string
  interval?: 'day' | 'hour'
}
