# @infinitetoken/lumber-kit

Shared TypeScript types, wire format contract, and query interfaces for the [Lumber](https://github.com/infinitetoken/Lumber) cloud logging suite.

## Install

```
npm install @infinitetoken/lumber-kit
```

## Usage

```typescript
import { LogLevel, LogRecord, EncryptedPayload, LogQuery } from '@infinitetoken/lumber-kit'
```

## Exports

| Export | Kind | Purpose |
|--------|------|---------|
| `LogLevel` | `const enum` | Log severity: Debug=0 Info=1 Warn=2 Error=3 Fatal=4 |
| `SubscriptionLevel` | `const enum` | User tier: Hobby=0 Dev=1 Pro=2 |
| `LogPayload` | interface | Plaintext fields before encryption |
| `EncryptedPayload` | interface | Wire format: `{ payload: string, v: number }` |
| `LogRecord` | interface | API response shape for a stored log |
| `AppRecord` | interface | API response shape for an app (no encryption_key) |
| `AppCreatedRecord` | interface | POST /apps 201 response only (includes encryption_key once) |
| `UserRecord` | interface | API response shape for a user (no password_digest) |
| `LogQuery` | interface | GET /logs filter params |
| `AppQuery` | interface | GET /apps filter params |

## Wire Format

`EncryptedPayload.payload` is `base64(IV[12 bytes] + AuthTag[16 bytes] + ciphertext)`.

The `v` field is always `1` for the current wire format. Changes to this format are semver major.

## const enum and Babel Consumers

`LogLevel` is a TypeScript `const enum`. TypeScript consumers have values inlined at compile time (zero runtime overhead).

If your project uses Babel, esbuild, or `isolatedModules: true`, the runtime enum object is available because Lumber-Kit is compiled with `preserveConstEnums: true`. No special configuration is needed in your project.

## Local Development (yalc)

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
