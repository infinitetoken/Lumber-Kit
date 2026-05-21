/**
 * Encrypted note content.
 * payload = base64(authTag + ciphertext)
 * nonce = base64(random IV)
 * keyVersion enables future key rotation.
 */
export interface NoteEncrypted {
  payload: string
  nonce: string
  keyVersion: number
}

/**
 * A short user-authored note, encrypted with the app key.
 * Visible to all members of the associated app.
 * Query by teamId in NotesQuery to build a cross-app team feed.
 */
export interface NoteRecord {
  id: string
  createdAt: string
  updatedAt: string

  appId: string
  userId: string
  logId?: string

  encrypted: NoteEncrypted
}

/**
 * Filter params for GET /notes.
 */
export interface NotesQuery {
  appId?: string
  teamId?: string
  userId?: string
  logId?: string

  from?: string
  to?: string
  sort?: string
  limit?: number
  cursor?: string
}
