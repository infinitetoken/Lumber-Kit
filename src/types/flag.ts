export interface FlagRecord {
  id: string
  createdAt: string
  updatedAt: string
  logId: string
  userId: string
}

export interface FlagsQuery {
  from?: string
  to?: string
  limit?: number
  cursor?: string
}
