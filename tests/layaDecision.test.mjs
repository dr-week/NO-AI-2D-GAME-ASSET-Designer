import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveCharacterDecision } from '../src/features/laya/model/characterDecision.ts'
import { characterDecisionQuestions } from '../src/features/laya/model/characterQuestions.ts'
import { parseLayaCommand } from '../src/features/laya/model/commands.ts'

function response(choice = 'balanced', probability = 0.9) {
  return {
    answers: Object.fromEntries(Object.keys(characterDecisionQuestions).map((key) => [key, {
      choice,
      probabilities: { [choice]: probability },
    }])),
  }
}

test('defines nine fixed typed questions with bounded options', () => {
  assert.equal(Object.keys(characterDecisionQuestions).length, 9)
  for (const question of Object.values(characterDecisionQuestions)) {
    assert.equal(question.type, 'choice')
    assert.equal(Object.keys(question.criteria).length, 5)
  }
})

test('maps valid choices to the existing bounded character controls', () => {
  const result = resolveCharacterDecision(response('large', 0.8))
  assert.equal(result.ok, true)
  assert.equal(result.confidence, 0.8)
  assert.deepEqual(result.config, {
    proportions: { head: 1.15, torso: 1.15, arms: 1.15, legs: 1.15 },
    boneScales: { torso: 1.15, upperArm: 1.15, forearm: 1.15, thigh: 1.15, lowerLeg: 1.15 },
  })
})

test('returns a manual fallback for missing or unsupported answers', () => {
  assert.equal(resolveCharacterDecision({}).ok, false)
  assert.equal(resolveCharacterDecision(response('invented')).ok, false)
})

test('returns a manual fallback when any answer is below confidence threshold', () => {
  const value = response()
  value.answers.thighLength.probabilities.balanced = 0.4
  assert.match(resolveCharacterDecision(value).reason, /uncertain/)
})

test('rejects non-finite or out-of-range probabilities', () => {
  const value = response()
  value.answers.armWidth.probabilities.balanced = Number.NaN
  assert.equal(resolveCharacterDecision(value).ok, false)
})

test('normalizes full-width command text and Unicode minus signs', () => {
  assert.deepEqual(parseLayaCommand('ｐｏｓｅ ｌｅｆｔ ｅｌｂｏｗ ４５°'), {
    type: 'pose', joint: 'elbowL', degrees: 45,
  })
  assert.deepEqual(parseLayaCommand('pose left elbow −４５°'), {
    type: 'pose', joint: 'elbowL', degrees: -45,
  })
})
