/**
 * A device link request: a new device asking for the account key from a device that has it. `failed` is a code that
 * didn't match, which ends the request.
 */
export type DeviceLinkStatus = 'pending' | 'approved' | 'denied' | 'failed'

/** What a request comes from, so the device answering it can say so and offer a QR code only to a phone's camera. */
export type DeviceLinkPlatform = 'ios' | 'android' | 'web' | 'desktop' | 'cli'

/**
 * Body of POST /device-links.
 */
export interface DeviceLinkCreateBody {
  deviceName: string
  platform: DeviceLinkPlatform
  /** The public half of the new device's one-off X25519 keypair, which the account key is wrapped to. */
  publicKey: string
  /** The new device's push device id, so the push asking the account's devices to link it skips it. */
  deviceId?: string
}

/**
 * Response from POST /device-links.
 */
export interface DeviceLinkCreatedRecord {
  id: string
  expiresAt: string
}

/**
 * Body of POST /device-links/:id/approve: the account key wrapped to the new device, and a tag over it made from the
 * code's secret, which the new device checks before storing the key, so the server can't hand it a key of its own.
 */
export interface DeviceLinkApproveBody {
  encryptedKey: string
  deliveryTag: string
}

/**
 * Response from GET /device-links/:id, as the new device reads it.
 * encryptedKey and deliveryTag are present only when status is 'approved'. sid and holderMessage are set once a device
 * holding the account key shows the request's code, and answeredAt once the new device has answered it.
 */
export interface DeviceLinkRecord {
  id: string
  status: DeviceLinkStatus
  encryptedKey?: string
  deliveryTag?: string
  expiresAt: string
  sid?: string | null
  holderMessage?: string | null
  answeredAt?: string | null
}

/**
 * A request waiting on the caller's account key (GET /device-links/pending), as a device holding it reads it: enough
 * to show its code, and to finish it once answered. The messages are the same password-authenticated exchange as a key
 * check's, so the server can't read or test codes against them. holderState is the code's side of the exchange, sealed
 * under the account key, so any of the account's devices can show the same code or finish the request.
 */
export interface PendingDeviceLink {
  id: string
  deviceName: string
  platform: DeviceLinkPlatform
  /** The new device's one-off public key, which an answer's tag has to cover before anything is wrapped to it. */
  publicKey: string
  sid: string | null
  holderMessage: string | null
  holderState: string | null
  claimantMessage: string | null
  tag: string | null
  answeredAt: string | null
  expiresAt: string
  createdAt: string
}
