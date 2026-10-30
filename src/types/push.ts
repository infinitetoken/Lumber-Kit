/**
 * The `data` a push notification carries, which the app reads to open the screen it's about. Expo delivers data as
 * JSON, but some platforms want strings, so every value is one.
 */
export type PushData =
  /** A log at or above the reader's threshold (Lumber-Worker). `level` is the LogLevel as a string. */
  | { type: 'log'; appId: string; logId: string; level: string }
  /** A note from someone else on an app the reader reads (Lumber-API). */
  | { type: 'note'; appId: string; noteId: string }
  /** A new device asking to link to the account (Lumber-Worker). */
  | { type: 'device_link'; deviceLinkId: string; deviceName: string }
  /** The new device entered its link code, which a device holding the account key now checks (Lumber-API). */
  | { type: 'device_link_answered'; deviceLinkId: string; deviceName: string }
  /** The person the reader gave a code entered it (Lumber-API). */
  | { type: 'key_check'; checkId: string }
  /** Someone is waiting for the reader to confirm their key, as new or changed (Lumber-API). */
  | { type: 'key_waiting'; userId: string }
  /** Someone wrapped app keys for the reader. `appId` when it was one app (Lumber-API). */
  | { type: 'keys_shared'; appId?: string }

export type PushType = PushData['type']
