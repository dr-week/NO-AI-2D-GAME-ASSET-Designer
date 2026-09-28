import type { BoneLengthScales } from '../../character/model/boneLengths.ts'
import type { CharacterProportions } from '../../character/model/proportions.ts'
import { characterDecisionQuestions, characterDecisionValues, type CharacterDecisionKey, type CharacterDecisionValue } from './characterQuestions.ts'

export type CharacterDecisionConfig = { proportions: CharacterProportions; boneScales: BoneLengthScales }
export type CharacterDecisionResult =
  | { ok: true; config: CharacterDecisionConfig; confidence: number }
  | { ok: false; reason: string }

const minimumProbability = 0.55

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function characterConfigFromChoices(choices: Record<CharacterDecisionKey, CharacterDecisionValue>): CharacterDecisionConfig {
  const config: CharacterDecisionConfig = {
    proportions: { head: 1, torso: 1, arms: 1, legs: 1 },
    boneScales: { torso: 1, upperArm: 1, forearm: 1, thigh: 1, lowerLeg: 1 },
  }
  const mappings: Record<CharacterDecisionKey, (scale: number) => void> = {
    headSize: (scale) => config.proportions.head = scale,
    torsoWidth: (scale) => config.proportions.torso = scale,
    armWidth: (scale) => config.proportions.arms = scale,
    legWidth: (scale) => config.proportions.legs = scale,
    torsoLength: (scale) => config.boneScales.torso = scale,
    upperArmLength: (scale) => config.boneScales.upperArm = scale,
    forearmLength: (scale) => config.boneScales.forearm = scale,
    thighLength: (scale) => config.boneScales.thigh = scale,
    lowerLegLength: (scale) => config.boneScales.lowerLeg = scale,
  }
  for (const key of Object.keys(characterDecisionQuestions) as CharacterDecisionKey[]) {
    mappings[key](characterDecisionValues[choices[key]])
  }
  return config
}

export function resolveCharacterDecision(result: unknown): CharacterDecisionResult {
  if (!isRecord(result) || !isRecord(result.answers)) return { ok: false, reason: 'Decision response is missing answers.' }

  const choices = {} as Record<CharacterDecisionKey, CharacterDecisionValue>
  let confidence = 1
  for (const key of Object.keys(characterDecisionQuestions) as CharacterDecisionKey[]) {
    const answer = result.answers[key]
    if (!isRecord(answer) || typeof answer.choice !== 'string' || !isRecord(answer.probabilities)) {
      return { ok: false, reason: `Decision for ${key} is incomplete; keep manual controls.` }
    }
    if (!Object.hasOwn(characterDecisionValues, answer.choice)) {
      return { ok: false, reason: `Decision for ${key} is unsupported; keep manual controls.` }
    }
    const probability = answer.probabilities[answer.choice]
    if (typeof probability !== 'number' || !Number.isFinite(probability) || probability < minimumProbability || probability > 1) {
      return { ok: false, reason: `Decision for ${key} is uncertain; keep manual controls.` }
    }
    confidence = Math.min(confidence, probability)
    choices[key] = answer.choice as CharacterDecisionValue
  }

  return { ok: true, config: characterConfigFromChoices(choices), confidence }
}
