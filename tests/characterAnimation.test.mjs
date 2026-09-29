import assert from 'node:assert/strict'
import test from 'node:test'
import { characterMotionClips, sampleCharacterClip } from '../src/features/character/model/animation.ts'
import { resolveSkeleton } from '../src/features/character/model/geometry.ts'
import { defaultFrontFacingTPose } from '../src/features/character/model/skeleton.ts'

const wave = characterMotionClips.wave

test('wave keyframes stay within skeleton joint limits', () => {
  for (const frame of wave.keyframes) assert.doesNotThrow(() => resolveSkeleton(defaultFrontFacingTPose, frame.pose))
})

test('clip sampling interpolates the wave and preserves unrelated manual pose', () => {
  const pose = sampleCharacterClip(wave, 0.125, { kneeL: 0.3 })
  assert.ok(Math.abs(pose.elbowR - -1.525) < 1e-9)
  assert.equal(pose.kneeL, 0.3)
})

test('clip sampling clamps to matching loop endpoints', () => {
  assert.deepEqual(sampleCharacterClip(wave, 0), sampleCharacterClip(wave, 1))
  assert.deepEqual(sampleCharacterClip(wave, -1), sampleCharacterClip(wave, 0))
  assert.deepEqual(sampleCharacterClip(wave, 2), sampleCharacterClip(wave, 1))
})

test('clip sampling rejects non-finite progress', () => {
  assert.throws(() => sampleCharacterClip(wave, Number.NaN), /must be finite/)
})
