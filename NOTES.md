# Lumber-Kit → Lumber-API Context Notes

## Subscription model: pure team-based

Subscriptions now live entirely on `TeamRecord`. `UserRecord` no longer has a `subscriptionLevel` field. All limit enforcement happens against the team's subscription.

Every user gets one personal team auto-created on signup (they are the `owner`). A user can own exactly one team but can be a member of unlimited teams.

## SubscriptionLimits changes

`memberships` renamed to `seats` — the number of team members allowed on a given plan.

| Tier | apps | seats | apiKeys | logRetentionDays | monthlyLogs | realtimeLogs | minPushLevel |
|---|---|---|---|---|---|---|---|
| Hobby | 5 | 1 | 1 | 7 | 10,000 | false | disabled |
| Dev | 10 | 5 | 5 | 30 | 250,000 | true | Error |
| Pro | 20 | 20 | 15 | 90 | 2,000,000 | true | Warn |
| Enterprise | ∞ | ∞ | ∞ | ∞ | ∞ | true | Debug |

## App accessibility

Team members have implicit access to all apps owned by their team. No per-app membership check is needed for team members.

`GuestRecord` (formerly `MembershipRecord`) exists for future use: inviting an external user (not on your team) to a specific app. It is not actively enforced yet. Roles: `owner | admin | read | write`.

## API enforcement implications

- Subscription limit checks: look up `team.subscriptionLevel`, compare against `subscriptionLimits[level]`
- Seat check on team member invite: `TeamMemberRecord` count vs `limits.seats`
- App access check: is the requesting user a `TeamMemberRecord` of the app's `teamId`? If yes, allow. `GuestRecord` check is a future addition.
- No per-user subscription logic anywhere — if a `UserRecord.subscriptionLevel` field exists in the DB, it is vestigial and should be ignored/removed

## Renamed types (Lumber-Kit)

| Old | New |
|---|---|
| `MembershipRecord` | `GuestRecord` |
| `SubscriptionLimits.memberships` | `SubscriptionLimits.seats` |
| `UserRecord.subscriptionLevel` | removed |
