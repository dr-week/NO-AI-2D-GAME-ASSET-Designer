import type { DatabaseSync } from 'node:sqlite'
import { validateLandscapeTemplate, validateLandscapeTemplateId, type LandscapeTemplate } from '../../src/features/landscape/model/templates.ts'

type StoredTemplate = { id: string; updated_at: string; payload_json: string }

export function listTemplates(database: DatabaseSync): LandscapeTemplate[] {
  const rows = database.prepare('SELECT id, updated_at, payload_json FROM landscape_templates ORDER BY updated_at DESC').all() as StoredTemplate[]
  return rows.map((row) => validateLandscapeTemplate(JSON.parse(row.payload_json)))
}

export function saveTemplate(database: DatabaseSync, value: unknown): LandscapeTemplate {
  const template = validateLandscapeTemplate(value)
  const statement = database.prepare(`
    INSERT INTO landscape_templates(id, updated_at, payload_json) VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET updated_at = excluded.updated_at, payload_json = excluded.payload_json
  `)
  statement.run(template.id, template.updatedAt, JSON.stringify(template))
  return template
}

export function saveTemplates(database: DatabaseSync, values: unknown[]): number {
  if (values.length > 100) throw new Error('A request can contain up to 100 templates.')
  const templates = values.map(validateLandscapeTemplate)
  if (new Set(templates.map(({ id }) => id)).size !== templates.length) throw new Error('Template IDs must be unique.')
  database.exec('BEGIN IMMEDIATE')
  try {
    for (const template of templates) saveTemplate(database, template)
    database.exec('COMMIT')
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }
  return templates.length
}

export function deleteTemplate(database: DatabaseSync, value: unknown): void {
  const id = validateLandscapeTemplateId(value)
  database.prepare('DELETE FROM landscape_templates WHERE id = ?').run(id)
}
