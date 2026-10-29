import { apiErrorCodeOf, isApiErrorCode, isValidAppearance, isValidColor, isValidImageUrl, isValidLogLevel, isValidSubscriptionLevel, isValidTeamMemberRole, joinApiKey, LogLevel, normalizePushThreshold, parsePushData, PUSH_OFF, splitApiKey, SubscriptionLevel, subscriptionLevels, subscriptionPlans } from '../index'

describe('isValidAppearance', () => {
  it('accepts valid values', () => {
    expect(isValidAppearance('system')).toBe(true)
    expect(isValidAppearance('dark')).toBe(true)
    expect(isValidAppearance('light')).toBe(true)
  })

  it('rejects invalid values', () => {
    expect(isValidAppearance('auto')).toBe(false)
    expect(isValidAppearance('')).toBe(false)
    expect(isValidAppearance(undefined)).toBe(false)
    expect(isValidAppearance(123)).toBe(false)
    expect(isValidAppearance(null)).toBe(false)
  })
})

describe('isValidColor', () => {
  it('accepts valid hex colors', () => {
    expect(isValidColor('#fff')).toBe(true)
    expect(isValidColor('#FFF')).toBe(true)
    expect(isValidColor('#1a2b3c')).toBe(true)
    expect(isValidColor('#A1B2C3')).toBe(true)
  })

  it('rejects invalid colors', () => {
    expect(isValidColor('red')).toBe(false)
    expect(isValidColor('#gggggg')).toBe(false)
    expect(isValidColor('#12345')).toBe(false)
    expect(isValidColor('#1234567')).toBe(false)
    expect(isValidColor('')).toBe(false)
    expect(isValidColor('ffffff')).toBe(false)
  })
})

describe('enum stability', () => {
  it('LogLevel has correct numeric values', () => {
    expect(LogLevel.Debug).toBe(0)
    expect(LogLevel.Info).toBe(1)
    expect(LogLevel.Warn).toBe(2)
    expect(LogLevel.Error).toBe(3)
    expect(LogLevel.Fatal).toBe(4)
  })

  it('SubscriptionLevel has correct numeric values', () => {
    expect(SubscriptionLevel.Hobby).toBe(0)
    expect(SubscriptionLevel.Dev).toBe(1)
    expect(SubscriptionLevel.Pro).toBe(2)
    expect(SubscriptionLevel.Enterprise).toBe(3)
  })
})

describe('isValidLogLevel', () => {
  it('accepts valid log levels', () => {
    expect(isValidLogLevel(0)).toBe(true)
    expect(isValidLogLevel(4)).toBe(true)
    expect(isValidLogLevel(LogLevel.Warn)).toBe(true)
  })

  it('rejects invalid values', () => {
    expect(isValidLogLevel(5)).toBe(false)
    expect(isValidLogLevel(-1)).toBe(false)
    expect(isValidLogLevel('debug')).toBe(false)
    expect(isValidLogLevel(null)).toBe(false)
    expect(isValidLogLevel(undefined)).toBe(false)
  })
})

describe('isValidSubscriptionLevel', () => {
  it('accepts valid subscription levels', () => {
    expect(isValidSubscriptionLevel(0)).toBe(true)
    expect(isValidSubscriptionLevel(3)).toBe(true)
    expect(isValidSubscriptionLevel(SubscriptionLevel.Pro)).toBe(true)
  })

  it('rejects invalid values', () => {
    expect(isValidSubscriptionLevel(4)).toBe(false)
    expect(isValidSubscriptionLevel(-1)).toBe(false)
    expect(isValidSubscriptionLevel('hobby')).toBe(false)
    expect(isValidSubscriptionLevel(null)).toBe(false)
    expect(isValidSubscriptionLevel(undefined)).toBe(false)
  })
})

describe('isValidTeamMemberRole', () => {
  it('accepts valid roles', () => {
    expect(isValidTeamMemberRole('owner')).toBe(true)
    expect(isValidTeamMemberRole('admin')).toBe(true)
    expect(isValidTeamMemberRole('member')).toBe(true)
  })

  it('rejects invalid values', () => {
    expect(isValidTeamMemberRole('read')).toBe(false)
    expect(isValidTeamMemberRole('write')).toBe(false)
    expect(isValidTeamMemberRole('')).toBe(false)
    expect(isValidTeamMemberRole(null)).toBe(false)
    expect(isValidTeamMemberRole(undefined)).toBe(false)
  })
})

describe('isValidImageUrl', () => {
  it('accepts valid absolute URLs', () => {
    expect(isValidImageUrl('https://example.com/avatar.png')).toBe(true)
    expect(isValidImageUrl('https://cdn.example.com/images/photo.jpg')).toBe(true)
    expect(isValidImageUrl('http://localhost:3000/image.png')).toBe(true)
  })

  it('rejects invalid values', () => {
    expect(isValidImageUrl('')).toBe(false)
    expect(isValidImageUrl('not-a-url')).toBe(false)
    expect(isValidImageUrl('/relative/path.png')).toBe(false)
    expect(isValidImageUrl(null)).toBe(false)
    expect(isValidImageUrl(undefined)).toBe(false)
    expect(isValidImageUrl(123)).toBe(false)
  })
})

describe('joinApiKey and splitApiKey', () => {
  const token = '0123456789abcdef0123456789abcdef'
  const encryptionKey = 'q83vEjRWeJCrze8SNFZ4kKvN7xI0VniQq83vEjRWeJA='

  it('joins a token and an encryption key with a dot', () => {
    expect(joinApiKey(token, encryptionKey)).toBe(`${token}.${encryptionKey}`)
  })

  it('splits a joined key back into its halves', () => {
    expect(splitApiKey(joinApiKey(token, encryptionKey))).toEqual({ token, encryptionKey })
  })

  it('reads a bare token as a key with no encryption key', () => {
    expect(splitApiKey(token)).toEqual({ token })
  })

  it('ignores surrounding whitespace, as from an env file', () => {
    expect(splitApiKey(`  ${token}.${encryptionKey}\n`)).toEqual({ token, encryptionKey })
  })
})

describe('normalizePushThreshold', () => {
  it('keeps log levels', () => {
    expect(normalizePushThreshold(LogLevel.Debug)).toBe(LogLevel.Debug)
    expect(normalizePushThreshold(LogLevel.Error)).toBe(LogLevel.Error)
    expect(normalizePushThreshold(LogLevel.Fatal)).toBe(LogLevel.Fatal)
  })

  it('turns anything past Fatal into PUSH_OFF', () => {
    expect(PUSH_OFF).toBe(5)
    expect(normalizePushThreshold(PUSH_OFF)).toBe(PUSH_OFF)
    expect(normalizePushThreshold(9)).toBe(PUSH_OFF)
    expect(normalizePushThreshold(4.4)).toBe(PUSH_OFF)
  })

  it('clamps below Debug and rounds fractions', () => {
    expect(normalizePushThreshold(-3)).toBe(LogLevel.Debug)
    expect(normalizePushThreshold(2.6)).toBe(LogLevel.Error)
  })

  it('reads numeric strings, as a JSON body can send them', () => {
    expect(normalizePushThreshold('3')).toBe(LogLevel.Error)
    expect(normalizePushThreshold('5')).toBe(PUSH_OFF)
  })

  it('gives Warn for anything that is not a finite number', () => {
    expect(normalizePushThreshold(undefined)).toBe(LogLevel.Warn)
    expect(normalizePushThreshold(null)).toBe(LogLevel.Warn)
    expect(normalizePushThreshold('')).toBe(LogLevel.Warn)
    expect(normalizePushThreshold('high')).toBe(LogLevel.Warn)
    expect(normalizePushThreshold(NaN)).toBe(LogLevel.Warn)
    expect(normalizePushThreshold(Infinity)).toBe(LogLevel.Warn)
  })
})

describe('subscriptionPlans', () => {
  it('names and prices every level', () => {
    expect(subscriptionLevels.map((level) => subscriptionPlans[level].name)).toEqual(['Hobby', 'Dev', 'Pro', 'Enterprise'])
    expect(subscriptionPlans[SubscriptionLevel.Hobby].monthlyPrice).toBe(0)
    expect(subscriptionPlans[SubscriptionLevel.Dev].monthlyPrice).toBe(9)
    expect(subscriptionPlans[SubscriptionLevel.Pro].monthlyPrice).toBe(39)
    expect(subscriptionPlans[SubscriptionLevel.Enterprise].monthlyPrice).toBeNull()
  })
})

describe('API error codes', () => {
  it('recognizes its codes', () => {
    expect(isApiErrorCode('SEAT_LIMIT')).toBe(true)
    expect(isApiErrorCode('HAS_ACCOUNT')).toBe(true)
    expect(isApiErrorCode('23505')).toBe(false)
    expect(isApiErrorCode(undefined)).toBe(false)
  })

  it('reads the code from an error body', () => {
    expect(apiErrorCodeOf({ message: 'Seat limit reached', code: 'SEAT_LIMIT' })).toBe('SEAT_LIMIT')
    expect(apiErrorCodeOf({ message: 'Seat limit reached' })).toBeNull()
    expect(apiErrorCodeOf({ message: 'Resource already exists', code: '23505' })).toBeNull()
    expect(apiErrorCodeOf(null)).toBeNull()
    expect(apiErrorCodeOf('SEAT_LIMIT')).toBeNull()
  })
})

describe('parsePushData', () => {
  it('reads each push type', () => {
    expect(parsePushData({ type: 'log', appId: 'a', logId: 'l', level: '3' })).toEqual({ type: 'log', appId: 'a', logId: 'l', level: '3' })
    expect(parsePushData({ type: 'note', appId: 'a', noteId: 'n' })).toEqual({ type: 'note', appId: 'a', noteId: 'n' })
    expect(parsePushData({ type: 'device_link', deviceLinkId: 'd', deviceName: 'iPad' })).toEqual({ type: 'device_link', deviceLinkId: 'd', deviceName: 'iPad' })
    expect(parsePushData({ type: 'key_check', checkId: 'c' })).toEqual({ type: 'key_check', checkId: 'c' })
    expect(parsePushData({ type: 'key_waiting', userId: 'u' })).toEqual({ type: 'key_waiting', userId: 'u' })
    expect(parsePushData({ type: 'keys_shared', appId: 'a' })).toEqual({ type: 'keys_shared', appId: 'a' })
    expect(parsePushData({ type: 'keys_shared' })).toEqual({ type: 'keys_shared' })
  })

  it('drops extra fields', () => {
    expect(parsePushData({ type: 'note', appId: 'a', noteId: 'n', title: 'x' })).toEqual({ type: 'note', appId: 'a', noteId: 'n' })
  })

  it('refuses data missing what its type needs, or of no known type', () => {
    expect(parsePushData({ type: 'log', appId: 'a' })).toBeNull()
    expect(parsePushData({ type: 'note', appId: '', noteId: 'n' })).toBeNull()
    expect(parsePushData({ type: 'key_check' })).toBeNull()
    expect(parsePushData({ type: 'other', appId: 'a' })).toBeNull()
    expect(parsePushData(null)).toBeNull()
    expect(parsePushData('log')).toBeNull()
  })
})
