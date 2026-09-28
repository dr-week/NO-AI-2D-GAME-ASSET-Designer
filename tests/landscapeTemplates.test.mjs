import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createLandscapeTemplateBackup,
  parseLandscapeTemplateBackup,
  serializeLandscapeTemplateBackup,
  validateLandscapeTemplate,
} from '../src/features/landscape/model/templates.ts'

const template = {
  version: 1,
  kind: '2dmaker-landscape-template',
  id: 'coast-01',
  name: 'Evening coast',
  createdAt: '2026-09-28T00:00:00.000Z',
  updatedAt: '2026-09-28T00:00:00.000Z',
  scene: { preset: 'coast', palette: 'dusk', seed: 210 },
}

test('validates a versioned landscape template and trims its name', () => {
  assert.equal(validateLandscapeTemplate({ ...template, name: '  Evening coast  ' }).name, 'Evening coast')
})

test('preserves procedural material settings and accepts older templates', () => {
  const withMaterial = validateLandscapeTemplate({ ...template, scene: { ...template.scene, material: 'ripple', materialLoop: true } })
  assert.equal(withMaterial.scene.material, 'ripple')
  assert.equal(withMaterial.scene.materialLoop, true)
  assert.deepEqual(validateLandscapeTemplate(template).scene, template.scene)
})

test('rejects unsupported format, unsafe IDs, invalid scene values, and oversized names', () => {
  assert.throws(() => validateLandscapeTemplate({ ...template, version: 2 }), /Unsupported/)
  assert.throws(() => validateLandscapeTemplate({ ...template, id: '../scene' }), /ID is invalid/)
  assert.throws(() => validateLandscapeTemplate({ ...template, name: 'x'.repeat(81) }), /name must/)
  assert.throws(() => validateLandscapeTemplate({ ...template, scene: { ...template.scene, seed: -1 } }), /scene settings/)
  assert.throws(() => validateLandscapeTemplate({ ...template, scene: { ...template.scene, preset: 'unknown' } }), /scene settings/)
  assert.throws(() => validateLandscapeTemplate({ ...template, scene: { ...template.scene, material: 'marble' } }), /scene settings/)
  assert.throws(() => validateLandscapeTemplate({ ...template, scene: { ...template.scene, materialLoop: 'yes' } }), /scene settings/)
})

test('template backup round-trips validated records', () => {
  const backup = parseLandscapeTemplateBackup(serializeLandscapeTemplateBackup([template]))
  assert.equal(backup.kind, '2dmaker-landscape-template-backup')
  assert.deepEqual(backup.templates[0], template)
})

test('rejects malformed and duplicate-ID backups', () => {
  assert.throws(() => parseLandscapeTemplateBackup('{'), /valid JSON/)
  assert.throws(() => createLandscapeTemplateBackup([template, template]), /IDs .* unique/)
  assert.throws(() => parseLandscapeTemplateBackup(JSON.stringify({ version: 1, kind: '2dmaker-landscape-template-backup', templates: [{ ...template, scene: { ...template.scene, palette: 'invalid' } }] })), /scene settings/)
})

test('rejects backups larger than the import boundary', () => {
  assert.throws(() => parseLandscapeTemplateBackup(' '.repeat(2_000_001)), /exceeds 2 MB/)
})
