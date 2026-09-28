import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { databasePath } from './config.ts'

export function openDatabase(): DatabaseSync {
  const path = databasePath()
  mkdirSync(dirname(path), { recursive: true })
  const database = new DatabaseSync(path, { timeout: 5_000 })
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    ) STRICT;
  `)
  database.exec('BEGIN IMMEDIATE')
  try {
    const current = database.prepare('SELECT COALESCE(MAX(version), 0) AS version FROM schema_migrations').get() as { version: number }
    if (current.version < 1) {
      database.exec(`
        CREATE TABLE landscape_templates (
          id TEXT PRIMARY KEY,
          updated_at TEXT NOT NULL,
          payload_json TEXT NOT NULL
        ) STRICT;
        CREATE INDEX landscape_templates_updated ON landscape_templates(updated_at DESC);
      `)
      database.prepare('INSERT INTO schema_migrations(version, applied_at) VALUES (?, ?)').run(1, new Date().toISOString())
    }
    database.exec('COMMIT')
  } catch (error) {
    database.exec('ROLLBACK')
    database.close()
    throw error
  }
  return database
}
