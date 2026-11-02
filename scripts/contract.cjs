// Writes contract/schema.json, a JSON Schema of every type the kit exports, for clients in other languages. The kit's
// TypeScript stays the source: `npm run contract` regenerates it, and a test fails while the committed copy is stale.
const fs = require('node:fs')
const path = require('node:path')

const { createGenerator } = require('ts-json-schema-generator')

const root = path.resolve(__dirname, '..')
const schemaPath = path.join(root, 'contract/schema.json')

const contractSchema = () => {
  const generator = createGenerator({
    path: path.join(root, 'src/{types,constants}/*.ts'),
    tsconfig: path.join(root, 'tsconfig.json'),
    type: '*',
    expose: 'export',
    // The generator brings its own TypeScript, older than the kit's, which can't read the shared tsconfig's newer
    // options; `npm run typecheck` checks the types
    skipTypeCheck: true
  })
  const { $schema, definitions } = generator.createSchema('*')
  return {
    $schema,
    $id: 'https://unpkg.com/@infinitetoken/lumber-kit/contract/schema.json',
    title: 'Lumber-Kit',
    description: "Every type Lumber-Kit exports, generated from its TypeScript. A log's POST /logs body is LogIngestBody, and the plaintext a plugin encrypts into it is LogPayload.",
    definitions
  }
}

const serialize = (schema) => `${JSON.stringify(schema, null, 2)}\n`

if (require.main === module) {
  fs.writeFileSync(schemaPath, serialize(contractSchema()))
  process.stdout.write(`Wrote ${path.relative(process.cwd(), schemaPath)}\n`)
}

module.exports = { contractSchema, schemaPath, serialize }
