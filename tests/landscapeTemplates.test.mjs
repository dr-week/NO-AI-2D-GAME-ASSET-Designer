import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createLandscapeTemplateBackup,
  parseLandscapeTemplateBackup,
  serializeLandscapeTemplateBackup,
  validateLandscapeTemplate,
} from '../src/features/landscape/model/templates.ts'
import { generateLandscape, landscapeCompositions, landscapeCompositionsFor, landscapeEnvironments, landscapeLighting, landscapePresets } from '../src/features/landscape/model/scene.ts'
import { renderEnvironmentArtwork } from '../src/features/landscape/model/environmentArtwork.ts'
import { renderSky } from '../src/features/landscape/model/lighting.ts'
import { landscapeSvgFileName } from '../src/features/landscape/io/sceneExport.ts'

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

test('renders every environment and lighting combination as reproducible SVG', () => {
  for (const environment of Object.keys(landscapeEnvironments)) {
    for (const lighting of Object.keys(landscapeLighting)) {
      const scene = { preset: 'coast', palette: 'dusk', seed: 210, environment, lighting }
      const first = generateLandscape(scene)
      assert.match(first, /^<svg\b/)
      assert.match(first, /<\/svg>$/)
      assert.equal(generateLandscape(scene), first)
    }
  }
})

test('every landform preset renders for every environment', () => {
  for (const preset of Object.keys(landscapePresets)) {
    for (const environment of Object.keys(landscapeEnvironments)) {
      assert.match(generateLandscape({ preset, palette: 'moss', seed: 9, environment, lighting: 'day' }), /<svg\b/)
    }
  }
})

test('composition choices create distinct repeatable scene structures', () => {
  const combos = Object.keys(landscapeCompositions).map((composition) => {
    for (const preset of Object.keys(landscapePresets)) {
      for (const environment of Object.keys(landscapeEnvironments)) {
        if (landscapeCompositionsFor(preset, environment).includes(composition)) return { composition, preset, environment }
      }
    }
    assert.fail(`No valid setting for ${composition}`)
  })
  const scenes = combos.map((scene) => generateLandscape({ ...scene, palette: 'dusk', seed: 91, lighting: 'day' }))
  assert.equal(new Set(scenes).size, Object.keys(landscapeCompositions).length)
  scenes.forEach((svg, index) => assert.equal(generateLandscape({ ...combos[index], palette: 'dusk', seed: 91, lighting: 'day' }), svg))
  const island = generateLandscape({ preset: 'coast', palette: 'dusk', seed: 91, composition: 'island' })
  assert.ok(island.indexOf('stroke-opacity=".2"') > island.indexOf('fill="#294c43"'))
  const withComposition = validateLandscapeTemplate({ ...template, scene: { ...template.scene, preset: 'mountain', composition: 'canyon' } })
  assert.equal(withComposition.scene.composition, 'canyon')
  assert.throws(() => validateLandscapeTemplate({ ...template, scene: { ...template.scene, composition: 'unknown' } }), /scene settings/)
})

test('temperate forest silhouettes vary by seed and stay grouped at frame edges', () => {
  const render = (seed) => renderEnvironmentArtwork('temperate', seed, 'hills', 'panorama')
  const forest = render(21)
  assert.equal(render(21), forest)
  assert.notEqual(render(22), forest)
  assert.equal((forest.match(/data-biome-x=/g) ?? []).length, 6)
  assert.equal((forest.match(/data-biome-prop="broadleaf"/g) ?? []).length, 4)
  assert.equal((forest.match(/data-biome-prop="conifer"/g) ?? []).length, 2)
  const positions = [...forest.matchAll(/data-biome-x="(\d+)"/g)].map(([, x]) => Number(x))
  assert.ok(positions.every((x) => x < 300 || x > 900))
})

test('night sky uses seeded constellations and moon phases without changing day sky', () => {
  const render = (seed) => renderSky('night', 'temperate', seed, '#f0b68d')
  const sky = render(81)
  assert.equal(render(81), sky)
  assert.notEqual(render(82), sky)
  assert.equal((sky.match(/data-sky-feature="constellation"/g) ?? []).length, 3)
  assert.equal((sky.match(/data-sky-feature="star"/g) ?? []).length, 34)
  assert.match(sky, /data-sky-feature="moon" data-moon-phase="/)
  const phases = new Set(Array.from({ length: 32 }, (_, seed) => renderSky('night', 'temperate', seed, '#f0b68d').match(/data-moon-phase="([^"]+)"/)?.[1]))
  assert.deepEqual([...phases].sort(), ['crescent', 'full', 'gibbous', 'quarter'])
  assert.match(renderSky('night', 'alien', 81, '#f0b68d'), /data-sky-feature="ringed-world".*data-sky-feature="orbiting-moon"/)
  assert.match(renderSky('night', 'arctic', 81, '#f0b68d'), /data-sky-feature="aurora"/)
  assert.doesNotMatch(renderSky('day', 'temperate', 81, '#f0b68d'), /data-sky-feature="(constellation|moon|star)"/)
})

test('SVG export filename identifies scene recipe and animated material state', () => {
  const scene = { preset: 'mountain', composition: 'overlook', environment: 'alien', lighting: 'night', theme: 'contemporary', palette: 'dusk', material: 'ripple', seed: 42, materialLoop: true }
  assert.equal(landscapeSvgFileName(scene), 'landscape-mountain-alien-overlook-night-contemporary-dusk-ripple-42-loop.svg')
  assert.equal(landscapeSvgFileName(template.scene), 'landscape-coast-temperate-island-golden-hour-contemporary-dusk-flat-210.svg')
})
