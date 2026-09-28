import assert from 'node:assert/strict'
import test from 'node:test'
import { createRidgePath, createRidgePoints } from '../src/features/landscape/model/ridge.ts'
import { generateLandscape } from '../src/features/landscape/model/scene.ts'

function random(seed) {
  let value = seed >>> 0
  return () => {
    value = (value + 0x6d2b79f5) | 0
    let next = value
    next = Math.imul(next ^ (next >>> 15), next | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

test('ridge points use stable, bounded variation from the seed', () => {
  const first = createRidgePoints(random(210), 300, 180)
  assert.deepEqual(first, createRidgePoints(random(210), 300, 180))
  assert.equal(first.length, 13)
  assert.equal(first[0].x, 0)
  assert.equal(first.at(-1).x, 1200)
  assert.ok(first.every(({ y }) => y >= 199 && y <= 401))
})

test('ridge paths curve the silhouette and close the scene shape', () => {
  const path = createRidgePath(createRidgePoints(random(44), 300, 100))
  assert.match(path, /^M0 [\d.]+ C/)
  assert.match(path, / 1200 [\d.]+ L1200 680 L0 680 Z$/)
  assert.doesNotMatch(path, / L100 /)
})

test('landscape geometry repeats for one seed and changes for another', () => {
  const scene = { preset: 'mountain', palette: 'moss', seed: 77, material: 'flat' }
  assert.equal(generateLandscape(scene), generateLandscape(scene))
  assert.notEqual(generateLandscape(scene), generateLandscape({ ...scene, seed: 78 }))
})
