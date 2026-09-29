import { mkdir, readdir, readFile, rmdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const directory = path.join(root, 'docs', 'contributions')
const args = process.argv.slice(2)
const dryRun = args[0] === '--dry-run'
const title = args.slice(dryRun ? 1 : 0).join(' ').trim()

if (!title || /[|\r\n]/.test(title)) {
  console.error('Usage: node scripts/new-contribution.mjs [--dry-run] "Short change title"')
  process.exit(1)
}

const slug = title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
if (!slug) throw new Error('Title must contain a letter or number.')

const indexPath = path.join(directory, 'README.md')
const lockPath = path.join(directory, '.index-lock')
if (!dryRun) {
  try {
    await mkdir(lockPath)
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error('Another contribution is being indexed. Retry after it finishes.')
    throw error
  }
}

try {
  const [files, index] = await Promise.all([readdir(directory), readFile(indexPath, 'utf8')])
  const fileNumbers = files.flatMap((name) => {
    const match = /^(\d{4})-[a-z0-9-]+\.md$/.exec(name)
    return match ? [Number(match[1])] : []
  })
  const indexRows = [...index.matchAll(/^\|\s*(\d{4})\s*\|.*$/gm)]
  if (!indexRows.length) throw new Error('Contribution index table was not found.')
  const indexNumbers = indexRows.map((row) => Number(row[1]))
  const number = Math.max(0, ...fileNumbers, ...indexNumbers) + 1
  if (number > 9999) throw new Error('Contribution number limit reached.')

  const id = String(number).padStart(4, '0')
  const recordName = `${id}-${slug}.md`
  if (dryRun) {
    console.log(`Next record: docs/contributions/${recordName}`)
    process.exit(0)
  }

  const recordPath = path.join(directory, recordName)
  const record = `# ${id} · ${title}\nStatus: active\nOwner: contributor\n\n## Files\n- \`path/to/file\` — [claimed] change\n\n## Checks\n- \`npm run verify\` — pending\n\n## Limits\n- None.\n`
  await writeFile(recordPath, record, { flag: 'wx' })
  try {
    const lastRow = indexRows.at(-1)
    const rowEnd = lastRow.index + lastRow[0].length
    const newline = index.slice(rowEnd).startsWith('\r\n') ? '\r\n' : '\n'
    const row = `| ${id} | [${title}](${recordName}) | Active |`
    await writeFile(indexPath, index.slice(0, rowEnd) + newline + row + index.slice(rowEnd))
  } catch (error) {
    await unlink(recordPath)
    throw error
  }

  console.log(`Created ${path.relative(root, recordPath)} and indexed it.`)
  console.log('Replace the claimed file placeholder, then keep status and checks current.')
} finally {
  if (!dryRun) await rmdir(lockPath)
}
