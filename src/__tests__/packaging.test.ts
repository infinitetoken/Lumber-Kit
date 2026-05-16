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

  t('exports logLevelToName mapping', () => {
    expect(kit.logLevelToName[0]).toBe('debug')
    expect(kit.logLevelToName[1]).toBe('info')
    expect(kit.logLevelToName[2]).toBe('warn')
    expect(kit.logLevelToName[3]).toBe('error')
    expect(kit.logLevelToName[4]).toBe('fatal')
  })

  t('exports SubscriptionLevel with correct numeric values', () => {
    expect(kit.SubscriptionLevel.Hobby).toBe(0)
    expect(kit.SubscriptionLevel.Dev).toBe(1)
    expect(kit.SubscriptionLevel.Pro).toBe(2)
    expect(kit.SubscriptionLevel.Enterprise).toBe(3)
  })

  t('exports subscriptionLevelToName mapping', () => {
    expect(kit.subscriptionLevelToName[0]).toBe('hobby')
    expect(kit.subscriptionLevelToName[1]).toBe('dev')
    expect(kit.subscriptionLevelToName[2]).toBe('pro')
    expect(kit.subscriptionLevelToName[3]).toBe('enterprise')
  })

  t('exports subscriptionLimits with correct shapes', () => {
    expect(kit.subscriptionLimits[0].apps).toBe(5)
    expect(kit.subscriptionLimits[1].apps).toBe(10)
    expect(kit.subscriptionLimits[2].apps).toBe(20)
    expect(kit.subscriptionLimits[3].apps).toBe(Infinity)
  })
})
