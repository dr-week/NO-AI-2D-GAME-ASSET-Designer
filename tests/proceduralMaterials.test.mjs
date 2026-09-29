import assert from 'node:assert/strict'
import test from 'node:test'
import { generateLandscape } from '../src/features/landscape/model/scene.ts'

const scene = { preset: 'coast', palette: 'dusk', seed: 210, material: 'grain', materialLoop: false }

test('procedural material is repeatable for a scene seed', () => {
  assert.equal(generateLandscape(scene), generateLandscape(scene))
})

test('flat material omits texture and animated pattern data', () => {
  const svg = generateLandscape({ ...scene, material: 'flat', materialLoop: true })
  assert.doesNotMatch(svg, /scene-material|animateTransform/)
})

test('looping material advances exactly one repeated tile forever', () => {
  const svg = generateLandscape({ ...scene, materialLoop: true })
  assert.match(svg, /<pattern id="scene-material" width="40"/)
  assert.match(svg, /from="0 0" to="40 0" dur="8s" repeatCount="indefinite"/)
  assert.match(svg, /prefers-reduced-motion: reduce/)
})

test('material types produce distinct vector patterns', () => {
  const grain = generateLandscape(scene)
  const ripple = generateLandscape({ ...scene, material: 'ripple' })
  assert.notEqual(grain.match(/<pattern[\s\S]*?<\/pattern>/)?.[0], ripple.match(/<pattern[\s\S]*?<\/pattern>/)?.[0])
})
