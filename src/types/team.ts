import { SubscriptionLevel } from '../constants'

/**
 * An organization that owns apps and pays for member usage.
 * Team subscriptionLevel takes precedence over individual member levels.
 */
export interface TeamRecord {
  id: string
  createdAt: string
  updatedAt: string

  name: string
  color?: string
  imageUrl?: string
  subscriptionLevel: SubscriptionLevel
}

/**
 * Membership of a user in a team.
 */
export interface TeamMemberRecord {
  id: string
  createdAt: string
  updatedAt: string

  teamId: string
  userId: string

  role: 'owner' | 'admin' | 'member'
}

/**
 * Filter params for GET /teams.
 */
export interface TeamsQuery {
  limit?: number
  cursor?: string
  sort?: string
}
