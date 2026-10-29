/**
 * Someone with access to an app who has no wrapped copy of its key yet (GET /apps/keys/pending), with when they last
 * replaced their account key: null if never, missing from an API before key pins.
 */
export interface PendingAppKey {
  appId: string
  userId: string
  publicKey: string
  keyChangedAt?: string | null
}

/**
 * Someone who reads one of the caller's apps and already has a wrapped copy of its key (GET /apps/keys/holders).
 */
export interface KeyHolder {
  userId: string
  publicKey: string
}

/**
 * Body of PUT /apps/:id/keys/:userId: the app key wrapped to that user's account key.
 */
export interface AppKeyUpsertBody {
  encryptedKey: string
}

/**
 * An account key a user has accepted for someone they share apps with (GET /key-pins). `mac` is an HMAC by the user's
 * own devices, under a key derived from their account key, over the user, the person and the key: the server can drop
 * a pin but not forge or move one.
 */
export interface KeyPin {
  userId: string
  publicKey: string
  mac: string
}

export type KeyCheckResult = 'confirmed' | 'failed' | 'cancelled'

/**
 * A key check the caller started, as their devices read it (GET /key-checks/mine): enough to show the code again or
 * finish the check. The messages are a password-authenticated exchange the server can't read or test codes against.
 */
export interface HolderKeyCheck {
  id: string
  userId: string
  sid: string
  holderMessage: string
  /** The holder's half of the exchange, sealed under their account key. */
  holderState: string
  claimantMessage: string | null
  publicKey: string | null
  tag: string | null
  answeredAt: string | null
  result: KeyCheckResult | null
  finishedAt: string | null
  expiresAt: string
  createdAt: string
}

/**
 * A key check waiting on the caller's answer, or how a recent answer went (GET /key-checks/for-me).
 */
export interface ClaimantKeyCheck {
  id: string
  holderId: string
  holderName: string
  sid: string
  holderMessage: string
  answeredAt: string | null
  result: KeyCheckResult | null
  finishedAt: string | null
  expiresAt: string
  createdAt: string
}
