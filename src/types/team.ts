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
  /** When a canceled plan stops; null while it renews. */
  subscriptionEnd?: string | null

  /** GET /teams only: the caller's role on the team. */
  role?: TeamMemberRecord['role']
  /** GET /teams only: the caller's membership id, which leaving the team deletes. */
  memberId?: string
  /** GET /teams only: the team's apps, as creating one counts them. Null unless the caller is its owner or an admin. */
  appCount?: number | null
  /** GET /teams only: logs its apps sent this UTC month, the monthly cap's count. Null unless owner or admin. */
  logsThisMonth?: number | null
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

  /** Listed members only: their display name. Never their email address. */
  name?: string | null
  /** Listed members only: the part of their email before the @. */
  handle?: string | null
  color?: string | null
  imageUrl?: string | null
}

/**
 * A plan GET /subscriptions offers, with its Stripe price (none for Hobby).
 */
export interface SubscriptionPlanRecord {
  name: string
  priceId: string | null
}

/**
 * Filter params for GET /teams.
 */
export interface TeamsQuery {
  sort?: string
  limit?: number
  cursor?: string
}
