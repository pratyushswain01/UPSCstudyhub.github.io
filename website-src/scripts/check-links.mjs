// Verifies every internal route in src/routes.ts points at a file that exists in the repository root.
import fs from 'node:fs'
import path from 'node:path'
const root = path.resolve(import.meta.dirname, '..', '..')
const src = fs.readFileSync(path.resolve(import.meta.dirname, '..', 'src', 'routes.ts'), 'utf8')
const hrefs = [...src.matchAll(/'(\/[^'#?]*)'/g)].map((m) => m[1])
let bad = 0
for (const h of new Set(hrefs)) {
  let f = path.join(root, h)
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html')
  const ok = fs.existsSync(f)
  if (!ok) bad++
  console.log(ok ? 'OK     ' : 'MISSING', h)
}
if (bad) { console.error(`\n${bad} missing route(s)`); process.exit(1) }
console.log('\nAll routes exist.')
