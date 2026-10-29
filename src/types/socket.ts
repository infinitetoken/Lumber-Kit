import type { AppRecord } from './app'
import type { FlagRecord } from './flag'
import type { LogRecord } from './log'
import type { NoteRecord } from './note'

/** An app as the socket sends it: no wrapped keys, so a client refetches through the API for its own copy. */
export type SocketAppPayload = Pick<AppRecord, 'id' | 'name' | 'teamId' | 'color' | 'imageUrl' | 'createdAt' | 'updatedAt'>

/**
 * What Lumber-Socket sends a client, for socket.io's typed `Server` and `Socket`. Each goes to the users who can read
 * the app it's about, live updates permitting (the app's team's plan); flags go to the user who set them.
 */
export interface ServerToClientEvents {
  'log:created': (log: Omit<LogRecord, 'updatedAt'> & { updatedAt?: string }) => void
  'flag:created': (flag: Omit<FlagRecord, 'updatedAt'> & { updatedAt?: string }) => void
  'flag:deleted': (flag: Pick<FlagRecord, 'id'>) => void
  'note:created': (note: NoteRecord) => void
  'note:updated': (note: NoteRecord) => void
  'note:deleted': (note: Pick<NoteRecord, 'id' | 'appId'>) => void
  'app:created': (app: SocketAppPayload) => void
  'app:updated': (app: SocketAppPayload) => void
  /** Deleted, or kept to its team's owner and so gone for the rest of the team. */
  'app:deleted': (app: Pick<AppRecord, 'id'>) => void
  /** Someone joined or left a team or app the user is on. Carries nothing; sent on every plan. */
  'access:changed': (payload: Record<string, never>) => void
  /**
   * The socket's database connection came back after a gap and has replayed what it could. Deletes, and anything older
   * or past the replay's cap, need the client's own resync.
   */
  'socket:reconnected': () => void
  /** The answer to `listMyApps`: the apps the user gets live updates for. */
  myApps: (payload: { apps: Pick<AppRecord, 'id' | 'name'>[] }) => void
  error: (payload: { message: string }) => void
}

/** What a client sends Lumber-Socket. */
export interface ClientToServerEvents {
  listMyApps: () => void
}
