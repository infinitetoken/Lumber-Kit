import { isValidAppearance, isValidColor, isValidImageUrl, isValidLogLevel, isValidSubscriptionLevel, isValidTeamMemberRole, LogLevel, SubscriptionLevel } from '../index'

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
