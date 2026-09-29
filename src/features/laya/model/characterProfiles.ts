import type { CharacterDecisionConfig } from './characterDecision.ts'

export type CharacterProfileId = 'balanced' | 'chibi' | 'heroic' | 'sturdy' | 'slender'
export type CharacterProfile = {
  id: CharacterProfileId
  category: 'body-proportion'
  name: string
  description: string
  aliases: readonly string[]
  config: CharacterDecisionConfig
}

const config = (
  proportions: CharacterDecisionConfig['proportions'],
  boneScales: CharacterDecisionConfig['boneScales'],
): CharacterDecisionConfig => ({ proportions, boneScales })

export const characterProfiles: Record<CharacterProfileId, CharacterProfile> = {
  balanced: {
    id: 'balanced', category: 'body-proportion', name: 'Balanced',
    description: 'Even starter proportions.', aliases: ['balanced', 'classic', 'normal'],
    config: config(
      { head: 1, torso: 1, arms: 1, legs: 1 },
      { torso: 1, upperArm: 1, forearm: 1, thigh: 1, lowerLeg: 1 },
    ),
  },
  chibi: {
    id: 'chibi', category: 'body-proportion', name: 'Chibi',
    description: 'Larger head, compact body and limbs.', aliases: ['chibi', 'cute', 'toy-like'],
    config: config(
      { head: 1.3, torso: 0.85, arms: 0.85, legs: 0.85 },
      { torso: 0.85, upperArm: 0.85, forearm: 0.85, thigh: 0.85, lowerLeg: 0.85 },
    ),
  },
  heroic: {
    id: 'heroic', category: 'body-proportion', name: 'Heroic',
    description: 'Broader torso with longer limbs.', aliases: ['heroic', 'hero', 'athletic'],
    config: config(
      { head: 0.85, torso: 1.15, arms: 1.15, legs: 1.15 },
      { torso: 1.15, upperArm: 1.15, forearm: 1.15, thigh: 1.15, lowerLeg: 1.15 },
    ),
  },
  sturdy: {
    id: 'sturdy', category: 'body-proportion', name: 'Sturdy',
    description: 'Wider body and shorter limbs.', aliases: ['sturdy', 'stocky', 'heavyset'],
    config: config(
      { head: 1, torso: 1.15, arms: 1.15, legs: 1.15 },
      { torso: 1, upperArm: 0.85, forearm: 0.85, thigh: 0.85, lowerLeg: 0.85 },
    ),
  },
  slender: {
    id: 'slender', category: 'body-proportion', name: 'Slender',
    description: 'Narrow body with longer limbs.', aliases: ['slender', 'lanky', 'lean'],
    config: config(
      { head: 0.85, torso: 0.85, arms: 0.85, legs: 0.85 },
      { torso: 1.15, upperArm: 1.15, forearm: 1.15, thigh: 1.15, lowerLeg: 1.15 },
    ),
  },
}
