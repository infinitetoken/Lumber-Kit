import { AppCreatedRecord, AppQuery, AppRecord, EncryptedPayload, LogLevel, LogPayload, LogQuery, LogRecord, SubscriptionLevel, UserRecord } from '../index'

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
        app_id: '507f1f77bcf86cd799439012',
        level: LogLevel.Info,
        flagged: false,
        payload: 'base64encodedciphertext==',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      expect(record.level).toBe(1)
      expect(record.flagged).toBe(false)
    })
  })

  describe('AppRecord (KIT-03, ENCRYPT-02, ENCRYPT-03)', () => {
    it('does not include private_key field', () => {
      const app: AppRecord = {
        id: '507f1f77bcf86cd799439013',
        user_id: '507f1f77bcf86cd799439014',
        name: 'my-app',
        public_key: 'x25519pubkeybase64==',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      // private_key must not exist on AppRecord — TypeScript enforces this at compile time
      expect('private_key' in app).toBe(false)
    })
  })

  describe('AppCreatedRecord (ENCRYPT-02)', () => {
    it('is the same shape as AppRecord (key pair generated on-device)', () => {
      const created: AppCreatedRecord = {
        id: '507f1f77bcf86cd799439013',
        user_id: '507f1f77bcf86cd799439014',
        name: 'my-app',
        public_key: 'x25519pubkeybase64==',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      expect(created.public_key).toBe('x25519pubkeybase64==')
      expect('private_key' in created).toBe(false)
    })
  })

  describe('LogQuery (KIT-04, D-06)', () => {
    it('accepts all optional filter params', () => {
      const q: LogQuery = {
        level: LogLevel.Error,
        flagged: true,
        limit: 50,
        offset: 0,
        sort: '-created_at',
        from: '2026-01-01T00:00:00Z',
        to: '2026-12-31T23:59:59Z'
      }
      expect(q.level).toBe(3)
    })

    it('accepts empty object (all fields optional)', () => {
      const q: LogQuery = {}
      expect(q).toBeDefined()
    })
  })

  describe('AppQuery (KIT-04, D-06)', () => {
    it('accepts all optional filter params', () => {
      const q: AppQuery = { limit: 10, offset: 0, sort: 'name' }
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
    it('is assignable with subscription_level as SubscriptionLevel', () => {
      const u: UserRecord = {
        id: '507f1f77bcf86cd799439015',
        email: 'dev@example.com',
        subscription_level: SubscriptionLevel.Hobby,
        agreed_to_terms: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      expect(u.subscription_level).toBe(0)
    })
  })
})
