# @infinitetoken/lumber-kit

Shared TypeScript types, wire format contract, and query interfaces for the [Lumber](https://github.com/infinitetoken/Lumber) cloud logging suite.

## Install

```
npm install @infinitetoken/lumber-kit
```

## Usage

```typescript
import { LogLevel, LogRecord, LogEncrypted, LogPayload, LogsQuery } from '@infinitetoken/lumber-kit'
```

## Exports

### Log types

| Export | Kind | Purpose |
|--------|------|---------|
| `LogLevel` | `const enum` | Log severity: Debug=0 Info=1 Warn=2 Error=3 Fatal=4 |
| `LogRecord` | interface | API response shape for a stored log |
| `LogEncrypted` | interface | Encrypted envelope: `{ nonce, payload, keyVersion }` |
| `LogPayload` | interface | Plaintext shape encrypted into `LogEncrypted` (client-side only) |
| `LogContext` | interface | Structured context fields (code location, custom fields) |
| `LogsQuery` | interface | Sync-protocol params for GET /logs |

### Subscription types

| Export | Kind | Purpose |
|--------|------|---------|
| `SubscriptionLevel` | `const enum` | Team tier: Hobby=0 Dev=1 Pro=2 Enterprise=3 |
| `subscriptionLevelToName` | object | Maps `SubscriptionLevel` to `'hobby' \| 'dev' \| 'pro' \| 'enterprise'` |
| `subscriptionLimits` | object | Per-tier limits (apps, seats, apiKeys, logRetentionDays, etc.) |
| `isValidSubscriptionLevel` | function | Type guard for `SubscriptionLevel` values |

### Flag types

| Export | Kind | Purpose |
|--------|------|---------|
| `FlagRecord` | interface | A user flag on a log: `{ id, createdAt, updatedAt, logId, userId }` |
| `FlagsQuery` | interface | Sync-protocol params for GET /flags |

### App / User / Team types

| Export | Kind | Purpose |
|--------|------|---------|
| `AppRecord` | interface | API response shape for an app |
| `AppCreatedRecord` | interface | POST /apps 201 response (includes `encryptedKey` once) |
| `UserRecord` | interface | API response shape for a user |
| `TeamRecord` | interface | API response shape for a team |
| `TeamMemberRecord` | interface | Team membership record |

### API keys

| Export | Kind | Purpose |
|--------|------|---------|
| `joinApiKey` | function | Joins an app's API token and its encryption key as `<token>.<encryptionKey>`, the one secret a plugin is configured with |
| `splitApiKey` | function | Splits an API key into `{ token, encryptionKey? }`; a bare token, as keys were before they were joined, has no encryption key |

A plugin sends only the token to the API (`Authorization: Bearer <token>`) and encrypts with the rest, so the encryption key never leaves it.

## Wire format

All log content is E2E encrypted before leaving the client. `LogRecord` contains only:

```typescript
{
  id:        string        // server-assigned
  createdAt: string        // ISO 8601
  updatedAt: string        // ISO 8601
  appId:     string
  encrypted: LogEncrypted  // opaque blob — server cannot read this
}
```

`LogEncrypted` uses AES-256-GCM:
- `nonce` — base64(random IV, 12 bytes)
- `payload` — base64(authTag[16 bytes] + ciphertext)
- `keyVersion` — always `1` for the current format; changes are semver major

The plaintext shape inside `payload` is `LogPayload`:

```typescript
{
  level:      LogLevel
  message:    string
  requestId?: string
  traceId?:   string
  context?:   LogContext
  metadata?:  Record<string, unknown>
}
```

## const enum and Babel consumers

`LogLevel` is a TypeScript `const enum`. TypeScript consumers have values inlined at compile time (zero runtime overhead).

If your project uses Babel, esbuild, or `isolatedModules: true`, the runtime enum object is available because Lumber-Kit is compiled with `preserveConstEnums: true`. No special configuration is needed.

## Local development (yalc)

Do NOT use `npm link` — it creates symlinks that break Metro in the Expo client.

```bash
# In Lumber-Kit:
npm run build
yalc publish

# In a consumer repo (Lumber-API, Lumber-Node, Lumber Expo client):
yalc add @infinitetoken/lumber-kit
npm install

# After updating Lumber-Kit:
npm run build
yalc push   # propagates to all linked consumers
```
