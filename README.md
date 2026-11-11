# @infinitetoken/lumber-kit

Shared TypeScript types, wire format contract, and query interfaces for the [Lumber](https://lumber.infinitetoken.com) cloud logging suite. Lumber is end-to-end encrypted: a client encrypts every log with AES-256-GCM before it leaves the process, and the server stores only ciphertext plus each log's level.

To send logs from your own code, you want a client rather than this package: [`@infinitetoken/lumber`](https://github.com/infinitetoken/Lumber-Node) for Node.js, [`lumber-cloud`](https://github.com/infinitetoken/Lumber-Python) for Python or [`lumber-go`](https://github.com/infinitetoken/lumber-go) for Go. The kit is what those clients and Lumber's own apps and services share, and its [contract](contract/README.md) is what a client in any language is tested against.

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

### Plans

| Export | Kind | Purpose |
|--------|------|---------|
| `subscriptionPlans` | object | Per-tier display name and monthly price in US dollars (0 free, `null` priced per customer) |
| `SubscriptionPlanRecord` | interface | A plan GET /subscriptions offers, with its Stripe price id |

### Notifications

| Export | Kind | Purpose |
|--------|------|---------|
| `PUSH_OFF` | constant | A push threshold one past Fatal (5): log pushes off |
| `PushThreshold` | type | A `LogLevel` or `PUSH_OFF`, stored as a preference's `minimumLevel` |
| `normalizePushThreshold` | function | A threshold from any stored or sent value: past Fatal is off, not a number is Warn |
| `PushData` | type | The `data` each push type carries (`log`, `note`, `device_link`, `device_link_answered`, `key_check`, `key_waiting`, `keys_shared`) |
| `parsePushData` | function | A push's data as `PushData`, or `null` for data no Lumber push sends |

### Socket events

| Export | Kind | Purpose |
|--------|------|---------|
| `ServerToClientEvents` | interface | Every event Lumber-Socket sends, for socket.io's typed `Server` and `Socket` |
| `ClientToServerEvents` | interface | Every event a client sends Lumber-Socket |
| `SocketAppPayload` | type | An app as the socket sends it (no wrapped keys) |

### Errors

| Export | Kind | Purpose |
|--------|------|---------|
| `ApiErrorCode` | type | Why the API refused, where the status alone doesn't say (`SEAT_LIMIT`, `ALREADY_MEMBER`, ...) |
| `apiErrorCodes` | array | Every `ApiErrorCode` |
| `ApiErrorBody` | interface | An error response's body: `{ message, code? }` |
| `apiErrorCodeOf` | function | The code in an error body, or `null` |

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
| `TimeFormat` | interface | How a user reads times on every device: `{ clock: '24h' \| '12h', zone: 'local' \| 'utc' }` |
| `DEFAULT_TIME_FORMAT` | constant | 24-hour, local: what a user gets until they pick one |
| `isValidTimeFormat` | function | A known clock and zone, and nothing else |
| `normalizeTimeFormat` | function | A stored or sent time format, each part the default when missing or unknown |
| `TeamRecord` | interface | API response shape for a team |
| `TeamMemberRecord` | interface | Team membership record (listed members carry name, handle, color and picture) |
| `AppTeamAccess` | type | Who on an app's team reads it: `'everyone'` or `'owner'` |
| `AppPermission` | type | `'read' \| 'write' \| 'manage'` on an app |
| `AppPersonRecord` | interface | Someone who can read an app, as GET /apps/:id/people shows them |
| `InvitationRecord` | interface | An invitation to an address with no account, to a team or an app |

### Key sharing

| Export | Kind | Purpose |
|--------|------|---------|
| `PendingAppKey` | interface | Someone with access to an app and no wrapped copy of its key |
| `KeyHolder` | interface | Someone who already holds a wrapped copy |
| `AppKeyUpsertBody` | interface | Body of PUT /apps/:id/keys/:userId |
| `KeyPin` | interface | An account key a user accepted for someone, with its MAC |
| `HolderKeyCheck`, `ClaimantKeyCheck`, `KeyCheckResult` | interfaces | A key check as the holder and the person being confirmed read it |
| `DeviceLinkCreateBody`, `DeviceLinkCreatedRecord` | interfaces | POST /device-links: a new device asking for the account key, and its answer |
| `DeviceLinkRecord`, `DeviceLinkApproveBody` | interfaces | A link request as the new device polls it (the exchange's first message once a code is shown, then the account key and the tag proving a device that showed the code sent it), and the approval that carries them |
| `PendingDeviceLink` | interface | A link request as a device holding the account key reads it, to show its code and finish it |
| `DeviceLinkStatus`, `DeviceLinkPlatform` | types | `pending`, `approved`, `denied` or `failed` (a code that didn't match); what the request comes from |

### Colors

| Export | Kind | Purpose |
|--------|------|---------|
| `logLevelColors` | object | Each `LogLevel`'s color, as the apps and the CLI draw it |
| `DEFAULT_ACCENT` | constant | The accent until someone picks their own (their account's `color`): amber `#FBBF24` |
| `APP_COLORS` | array | The twelve colors `nameColor` picks from |
| `nameColor` | function | A stable color for a name, ignoring case and surrounding spaces, the same on every device |
| `resolveAppColor` | function | An app's own color, or its name's |
| `personColor` | function | Someone else's color, from their user id |

### API keys

| Export | Kind | Purpose |
|--------|------|---------|
| `joinApiKey` | function | Joins an app's API token and its encryption key as `<token>.<encryptionKey>`, the one secret a plugin is configured with |
| `splitApiKey` | function | Splits an API key into `{ token, encryptionKey? }`; a value with no dot is all token |

A plugin sends only the token to the API (`Authorization: Bearer <token>`) and encrypts with the rest, so the encryption key never leaves it.

### Plugins

| Export | Kind | Purpose |
|--------|------|---------|
| `LogIngestBody` | interface | `POST /logs`' body: `{ level, encrypted }` |
| `LogData` | interface | What a log call takes beside its message: `requestId`, `traceId`, `context`, `metadata` and any other keys |
| `buildLogPayload` | function | The `LogPayload` a log call encrypts, from its level, message, data and the plugin's automatic context |
| `DEFAULT_API_ENDPOINT` | constant | `https://api.lumber.infinitetoken.com` |
| `LOG_KEY_VERSION` | constant | `LogEncrypted`'s `keyVersion` (1) |
| `logDelivery` | object | Attempts, retry delays and the pause after a 429 |
| `logDeliveryOutcome` | function | `sent`, `retry`, `drop` or `pause` for a `POST /logs` status (null for a network error) |
| `logRetryDelayMs` | function | The wait after a log's nth failed attempt: 1s, 2s, 4s, up to 30s |

## Wire format

All log content is E2E encrypted before leaving the client. `LogRecord` contains only:

```typescript
{
  id:        string        // server-assigned
  createdAt: string        // ISO 8601
  updatedAt: string        // ISO 8601
  appId:     string
  encrypted: LogEncrypted  // opaque to the server, which can't read it
}
```

`LogEncrypted` uses AES-256-GCM:
- `nonce`: base64(random IV, 12 bytes)
- `payload`: base64(authTag[16 bytes] + ciphertext)
- `keyVersion`: always `1` for the current format; changes are semver major

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

## Other languages

TypeScript can't be imported from Python or Go, so the kit ships its contract in `contract/`: a JSON Schema of every exported type (`schema.json`, generated from the TypeScript by `npm run contract`) and known answers (`vectors.json`) for API keys, AES-256-GCM, payloads and delivery, which the kit's own tests check against its code. Lumber-Python and Lumber-Go test against a pinned copy. See [`contract/README.md`](contract/README.md).

## const enum and Babel consumers

`LogLevel` is a TypeScript `const enum`. TypeScript consumers have values inlined at compile time (zero runtime overhead).

If your project uses Babel, esbuild, or `isolatedModules: true`, the runtime enum object is available because Lumber-Kit is compiled with `preserveConstEnums: true`. No special configuration is needed.

## Developing

```bash
npm install
npm run verify     # lint, test, typecheck, build
npm run contract   # regenerate contract/schema.json after changing a type
```

To try a change in a project that uses the kit before it's published, use [yalc](https://github.com/wclr/yalc) rather than `npm link`, whose symlinks break Metro (React Native's bundler):

```bash
# In Lumber-Kit
npm run build
yalc publish

# In the project using it
yalc add @infinitetoken/lumber-kit
npm install

# After each change to Lumber-Kit
npm run build
yalc push   # updates every project that added it
```
