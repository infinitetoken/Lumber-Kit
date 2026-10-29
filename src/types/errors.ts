import type { ApiErrorCode } from '../constants'

/**
 * The body of an API error response. `code` is there where the status alone doesn't say what went wrong.
 */
export interface ApiErrorBody {
  message: string
  code?: ApiErrorCode
}
