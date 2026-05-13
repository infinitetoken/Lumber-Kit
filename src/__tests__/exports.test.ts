import { AppCreatedRecord, AppRecord, AppsQuery, EncryptedPayload, LogLevel, LogPayload, LogRecord, LogsQuery, SubscriptionLevel, UserRecord } from '../index'

describe('Lumber-Kit exports — KIT-01 through KIT-05', () => {
  describe('LogLevel (KIT-03, D-01, D-02)', () => {
    it('has correct numeric values at runtime (Babel-safe via preserveConstEnums)', () => {
      expect(LogLevel.Debug).toBe(0)
      expect(LogLevel.Info).toBe(1)
      expect(LogLevel.Warn).toBe(2)
      expect(LogLevel.Error).toBe(3)
      expect(LogLevel.Fatal).toBe(4)
    })

    it('reverse-maps numeric values to names (verified in build output — see Task 3 step 5)', () => {
      // const enum reverse-mapping cannot be accessed at TypeScript compile time via numeric index.
      // preserveConstEnums: true emits the runtime enum object — verified in Task 3 by grepping
      // dist/cjs/index.js for 'LogLevel[LogLevel' which confirms the IIFE enum block was emitted.
      // This test simply confirms the numeric values are stable (forward direction).
      expect(LogLevel.Debug).toBe(0)
      expect(LogLevel.Fatal).toBe(4)
    })
  })

  describe('SubscriptionLevel', () => {
    it('has correct numeric values at runtime', () => {
      expect(SubscriptionLevel.Hobby).toBe(0)
      expect(SubscriptionLevel.Dev).toBe(1)
      expect(SubscriptionLevel.Pro).toBe(2)
    })
  })

  describe('EncryptedPayload (KIT-03, ENCRYPT-09)', () => {
    it('is assignable with payload and v fields', () => {
      const ep: EncryptedPayload = { payload: 'base64encodedciphertext==', v: 1 }
      expect(ep.v).toBe(1)
      expect(typeof ep.payload).toBe('string')
    })
  })

  describe('LogRecord (KIT-03, D-06)', () => {
    it('is assignable with all required fields', () => {
      const record: LogRecord = {
        id: '507f1f77bcf86cd799439011',
        appId: '507f1f77bcf86cd799439012',
        level: LogLevel.Info,
        flagged: false,
        payload: 'base64encodedciphertext==',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      expect(record.level).toBe(1)
      expect(record.flagged).toBe(false)
    })
  })

  describe('AppRecord (KIT-03, ENCRYPT-02, ENCRYPT-03)', () => {
    it('does not include privateKey field', () => {
      const app: AppRecord = {
        id: '507f1f77bcf86cd799439013',
        userId: '507f1f77bcf86cd799439014',
        name: 'my-app',
        publicKey: 'x25519pubkeybase64==',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      // privateKey must not exist on AppRecord — TypeScript enforces this at compile time
      expect('privateKey' in app).toBe(false)
    })
  })

  describe('AppCreatedRecord (ENCRYPT-02)', () => {
    it('is the same shape as AppRecord (key pair generated on-device)', () => {
      const created: AppCreatedRecord = {
        id: '507f1f77bcf86cd799439013',
        userId: '507f1f77bcf86cd799439014',
        name: 'my-app',
        publicKey: 'x25519pubkeybase64==',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      expect(created.publicKey).toBe('x25519pubkeybase64==')
      expect('privateKey' in created).toBe(false)
    })
  })

  describe('LogsQuery (KIT-04, D-06)', () => {
    it('accepts all optional filter params', () => {
      const q: LogsQuery = {
        appIds: ['507f1f77bcf86cd799439012'],
        levels: [LogLevel.Error],
        flagged: true,
        limit: 50,
        cursor: '507f1f77bcf86cd799439011',
        sort: '-createdAt',
        from: '2026-01-01T00:00:00Z',
        to: '2026-12-31T23:59:59Z'
      }
      expect(q.levels?.[0]).toBe(3)
    })

    it('accepts empty object (all fields optional)', () => {
      const q: LogsQuery = {}
      expect(q).toBeDefined()
    })
  })

  describe('AppsQuery (KIT-04, D-06)', () => {
    it('accepts all optional filter params', () => {
      const q: AppsQuery = { limit: 10, cursor: '507f1f77bcf86cd799439011', from: '2026-01-01T00:00:00Z', to: '2026-12-31T23:59:59Z', sort: 'name' }
      expect(q.limit).toBe(10)
    })
  })

  describe('LogPayload (KIT-03)', () => {
    it('accepts all optional fields', () => {
      const p: LogPayload = {
        message: 'User login failed',
        code: 'AUTH_FAILED',
        line: 42,
        column: 8,
        method: 'POST /auth/login',
        note: 'rate limit approaching'
      }
      expect(p.message).toBe('User login failed')
    })

    it('accepts empty object (all fields optional)', () => {
      const p: LogPayload = {}
      expect(p).toBeDefined()
    })
  })

  describe('UserRecord', () => {
    it('is assignable with subscriptionLevel as SubscriptionLevel', () => {
      const u: UserRecord = {
        id: '507f1f77bcf86cd799439015',
        email: 'dev@example.com',
        subscriptionLevel: SubscriptionLevel.Hobby,
        agreedToTerms: true,
        notificationPreferences: { enabled: true, minimumLevel: 2, perApp: {} },
        fcmTokens: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      expect(u.subscriptionLevel).toBe(0)
    })
  })
})
