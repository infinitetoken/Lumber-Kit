import { isValidAppearance, isValidColor, LogLevel, SubscriptionLevel } from '../index'

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
