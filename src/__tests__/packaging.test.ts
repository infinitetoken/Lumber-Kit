import fs from 'fs'
import path from 'path'

const distPath = path.resolve(__dirname, '../../dist/cjs/index.js')

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const kit: any = fs.existsSync(distPath) ? require(distPath) : null
const t = kit != null ? it : it.skip

describe('packaging smoke — dist/cjs (requires `npm run build`)', () => {
  t('exports LogLevel with correct numeric values', () => {
    expect(kit.LogLevel.Debug).toBe(0)
    expect(kit.LogLevel.Info).toBe(1)
    expect(kit.LogLevel.Warn).toBe(2)
    expect(kit.LogLevel.Error).toBe(3)
    expect(kit.LogLevel.Fatal).toBe(4)
  })

  t('exports SubscriptionLevel with correct numeric values', () => {
    expect(kit.SubscriptionLevel.Hobby).toBe(0)
    expect(kit.SubscriptionLevel.Dev).toBe(1)
    expect(kit.SubscriptionLevel.Pro).toBe(2)
    expect(kit.SubscriptionLevel.Enterprise).toBe(3)
  })

  t('exports levelToName mapping', () => {
    expect(kit.levelToName[0]).toBe('hobby')
    expect(kit.levelToName[1]).toBe('dev')
    expect(kit.levelToName[2]).toBe('pro')
    expect(kit.levelToName[3]).toBe('enterprise')
  })

  t('exports subscriptionLimits with correct shapes', () => {
    expect(kit.subscriptionLimits[0].apps).toBe(1)
    expect(kit.subscriptionLimits[1].apps).toBe(5)
    expect(kit.subscriptionLimits[2].apps).toBe(15)
    expect(kit.subscriptionLimits[3].apps).toBe(Infinity)
  })
})
