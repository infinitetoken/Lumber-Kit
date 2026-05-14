import { LogLevel, SubscriptionLevel } from '../index'

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
