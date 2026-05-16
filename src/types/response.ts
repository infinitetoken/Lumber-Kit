export interface ResponseMetadata {
  requestId: string
  durationMs: number
  warnings?: string[]
  cursor?: string | null
  hasMore?: boolean
  count?: number
  hiddenCount?: number
}

export interface ApiResponse<T> {
  data: T
  metadata: ResponseMetadata
}
