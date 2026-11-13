export interface ResponseMetadata {
  requestId: string
  durationMs: number
  warnings?: string[]
  cursor?: string | null
  hasMore?: boolean
  count?: number
  /** POST /logs past the team's monthly logs: how many logs it dropped (1), below ERROR (monthlyLogsCap). */
  dropped?: number
  /** With `dropped`: when every level is taken again (the next UTC month), an ISO time. */
  cappedUntil?: string
}

export interface ApiResponse<T> {
  data: T
  metadata: ResponseMetadata
}
