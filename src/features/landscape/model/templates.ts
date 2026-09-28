import { landscapePalettes, landscapePresets, type LandscapeScene } from './scene.ts'
import { landscapeMaterials } from './materials.ts'
import { isLandscapeThemeId, type LandscapeThemeId } from './themes.ts'

export type LandscapeTemplate = {
  version: 1
  kind: '2dmaker-landscape-template'
  id: string
  name: string
  createdAt: string
  updatedAt: string
  scene: LandscapeScene
}

export type LandscapeTemplateBackup = {
  version: 1
  kind: '2dmaker-landscape-template-backup'
  templates: LandscapeTemplate[]
}

const maxNameLength = 80
const maxTemplates = 100
const safeId = /^[a-zA-Z0-9_-]{1,80}$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}

export function validateLandscapeTemplateId(value: unknown): string {
  if (typeof value !== 'string' || !safeId.test(value)) throw new Error('Template ID is invalid.')
  return value
}

export function validateLandscapeTemplate(value: unknown): LandscapeTemplate {
  if (!isRecord(value) || value.version !== 1 || value.kind !== '2dmaker-landscape-template') throw new Error('Unsupported landscape template format.')
  const { id, name, createdAt, updatedAt, scene } = value
  const validId = validateLandscapeTemplateId(id)
  if (typeof name !== 'string' || !name.trim() || name.length > maxNameLength) throw new Error('Template name must be 1–80 characters.')
  if (!isDate(createdAt) || !isDate(updatedAt)) throw new Error('Template timestamps are invalid.')
  if (!isRecord(scene) || typeof scene.preset !== 'string' || !Object.hasOwn(landscapePresets, scene.preset) || typeof scene.palette !== 'string' || !Object.hasOwn(landscapePalettes, scene.palette) || typeof scene.seed !== 'number' || !Number.isSafeInteger(scene.seed) || scene.seed < 0 || scene.seed > 0xffffffff || (scene.theme !== undefined && !isLandscapeThemeId(scene.theme)) || (scene.material !== undefined && (typeof scene.material !== 'string' || !Object.hasOwn(landscapeMaterials, scene.material))) || (scene.materialLoop !== undefined && typeof scene.materialLoop !== 'boolean')) {
    throw new Error('Template scene settings are invalid.')
  }
  return {
    version: 1,
    kind: '2dmaker-landscape-template',
    id: validId,
    name: name.trim(),
    createdAt,
    updatedAt,
    scene: { preset: scene.preset as LandscapeScene['preset'], palette: scene.palette as LandscapeScene['palette'], seed: scene.seed, ...(scene.theme ? { theme: scene.theme as LandscapeThemeId } : {}), ...(scene.material ? { material: scene.material as LandscapeScene['material'] } : {}), ...(scene.materialLoop !== undefined ? { materialLoop: scene.materialLoop } : {}) },
  }
}

export function createLandscapeTemplate(name: string, scene: LandscapeScene, now = new Date()): LandscapeTemplate {
  return validateLandscapeTemplate({
    version: 1,
    kind: '2dmaker-landscape-template',
    id: crypto.randomUUID(),
    name,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    scene: { ...scene, theme: scene.theme ?? 'contemporary' },
  })
}

export function createLandscapeTemplateBackup(templates: LandscapeTemplate[]): LandscapeTemplateBackup {
  if (templates.length > maxTemplates) throw new Error(`A backup can contain up to ${maxTemplates} templates.`)
  const validated = templates.map(validateLandscapeTemplate)
  if (new Set(validated.map((template) => template.id)).size !== validated.length) throw new Error('Template IDs in a backup must be unique.')
  return { version: 1, kind: '2dmaker-landscape-template-backup', templates: validated }
}

export function serializeLandscapeTemplateBackup(templates: LandscapeTemplate[]): string {
  return JSON.stringify(createLandscapeTemplateBackup(templates))
}

export function parseLandscapeTemplateBackup(serialized: string): LandscapeTemplateBackup {
  if (serialized.length > 2_000_000) throw new Error('Template backup exceeds 2 MB.')
  let value: unknown
  try { value = JSON.parse(serialized) }
  catch { throw new Error('Template backup is not valid JSON.') }
  if (!isRecord(value) || value.version !== 1 || value.kind !== '2dmaker-landscape-template-backup' || !Array.isArray(value.templates) || value.templates.length > maxTemplates) throw new Error('Unsupported landscape template backup.')
  return createLandscapeTemplateBackup(value.templates)
}
