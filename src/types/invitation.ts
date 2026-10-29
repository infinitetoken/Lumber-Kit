/**
 * An invitation to an address with no account yet: to a team (teamId, as a member or admin) or to one app as its guest
 * (appId). The address joins when it signs up and confirms itself. A live one (unexpired) holds its seat.
 */
export interface InvitationRecord {
  id: string
  teamId: string | null
  appId: string | null
  email: string
  role: string
  /** Null when its email couldn't be sent. */
  sentAt: string | null
  expiresAt: string
  createdAt: string
}
