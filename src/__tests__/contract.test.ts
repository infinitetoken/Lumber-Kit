import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import Ajv from 'ajv'

import { buildLogPayload, DEFAULT_API_ENDPOINT, LOG_KEY_VERSION, type LogData, logDelivery, logDeliveryOutcome, type LogLevel, logLevelNameToLevel, type LogPayload, logRetryDelayMs, splitApiKey } from '../index'

// The contract other languages are tested against: these tests are what keep it the kit's own answers
const contractDir = path.resolve(__dirname, '../../contract')
type Named = { name: string }
type ApiKeyVector = Named & { apiKey: string; token: string; encryptionKey: string | null }
type EncryptionVector = Named & { key: string; nonce: string; plaintext: string; payload: string }
type PayloadVector = Named & { level: LogLevel; message: string; data?: LogData; autoContext?: Record<string, unknown>; payload: LogPayload }

const vectors = JSON.parse(fs.readFileSync(path.join(contractDir, 'vectors.json'), 'utf8'))
const schema = JSON.parse(fs.readFileSync(path.join(contractDir, 'schema.json'), 'utf8'))

const ajv = new Ajv({ allErrors: true, strict: false })
ajv.addSchema(schema)
const validator = (name: string) => ajv.getSchema(`${schema.$id}#/definitions/${name}`)!

describe('contract/schema.json', () => {
  it('is generated from the current types (run `npm run contract` after changing one)', () => {
    const { contractSchema, serialize } = require('../../scripts/contract.cjs')
    expect(fs.readFileSync(path.join(contractDir, 'schema.json'), 'utf8')).toBe(serialize(contractSchema()))
  }, 30_000)

  it('describes the ingestion body and the plaintext payload', () => {
    const body = validator('LogIngestBody')
    expect(body({ level: 3, encrypted: { nonce: 'n', payload: 'p', keyVersion: 1 } })).toBe(true)
    expect(body({ level: 3, encrypted: { nonce: 'n', payload: 'p' } })).toBe(false)
    expect(body({ level: 9, encrypted: { nonce: 'n', payload: 'p', keyVersion: 1 } })).toBe(false)
    // A misspelled field (snake_case from another language) is refused rather than silently lost
    expect(validator('LogPayload')({ level: 1, message: 'm', request_id: 'r' })).toBe(false)
  })
})

describe('contract/vectors.json', () => {
  it('has the kit constants', () => {
    const { constants } = vectors
    expect(constants.defaultEndpoint).toBe(DEFAULT_API_ENDPOINT)
    expect(constants.keyVersion).toBe(LOG_KEY_VERSION)
    expect(constants.levels).toEqual(logLevelNameToLevel)
    expect(constants.delivery).toEqual(logDelivery)
  })

  it.each(vectors.apiKeys as ApiKeyVector[])('splits an API key: $name', (v) => {
    expect(splitApiKey(v.apiKey)).toEqual(v.encryptionKey === null ? { token: v.token } : { token: v.token, encryptionKey: v.encryptionKey })
  })

  it.each(vectors.encryption as EncryptionVector[])('encrypts with AES-256-GCM: $name', (v) => {
    const key = Buffer.from(v.key, 'base64')
    const nonce = Buffer.from(v.nonce, 'base64')
    expect(key).toHaveLength(vectors.constants.keyBytes)
    expect(nonce).toHaveLength(vectors.constants.nonceBytes)

    const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce)
    const ciphertext = Buffer.concat([cipher.update(v.plaintext, 'utf8'), cipher.final()])
    expect(Buffer.concat([cipher.getAuthTag(), ciphertext]).toString('base64')).toBe(v.payload)

    const sealed = Buffer.from(v.payload, 'base64')
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce)
    decipher.setAuthTag(sealed.subarray(0, vectors.constants.tagBytes))
    const plaintext = Buffer.concat([decipher.update(sealed.subarray(vectors.constants.tagBytes)), decipher.final()]).toString('utf8')
    expect(plaintext).toBe(v.plaintext)
    expect(validator('LogPayload')(JSON.parse(plaintext))).toBe(true)
  })

  it.each(vectors.payloads as PayloadVector[])('builds a payload: $name', (v) => {
    const payload = buildLogPayload(v.level, v.message, v.data, v.autoContext)
    expect(payload).toEqual(v.payload)
    expect(validator('LogPayload')(payload)).toBe(true)
  })

  it('decides what each answer means', () => {
    for (const { status, outcome } of vectors.deliveryOutcomes) expect([status, logDeliveryOutcome(status)]).toEqual([status, outcome])
    expect(validator('LogDeliveryOutcome')('pause')).toBe(true)
  })

  it('waits longer after each failure', () => {
    for (const { failedAttempts, delayMs } of vectors.retryDelaysMs) expect([failedAttempts, logRetryDelayMs(failedAttempts)]).toEqual([failedAttempts, delayMs])
  })
})
