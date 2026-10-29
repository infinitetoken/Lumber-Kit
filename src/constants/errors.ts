/**
 * Machine-readable reasons the API refuses a request, sent as `code` beside `message` where one status means more than
 * one thing. Messages are for people and may change; clients decide by the code.
 */
export const apiErrorCodes = [
  /** 403: the team's plan has no room for another app. */
  'APP_LIMIT',
  /** 403: the team's plan has no room for another member (members and live invitations). */
  'SEAT_LIMIT',
  /** 403: the app's team's plan has no room for another guest on it (guests and live invitations). */
  'GUEST_LIMIT',
  /** 409: the person invited is already on the team. */
  'ALREADY_MEMBER',
  /** 409: the person invited can already read the app. */
  'ALREADY_READS',
  /** 409: the address invited already has an open invitation. */
  'ALREADY_INVITED',
  /** 409: the address invited already has an account, so invite the person instead. */
  'HAS_ACCOUNT'
] as const

export type ApiErrorCode = (typeof apiErrorCodes)[number]
