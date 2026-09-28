export type CharacterProportions = {
  head: number
  torso: number
  arms: number
  legs: number
}

export const defaultCharacterProportions: CharacterProportions = {
  head: 1,
  torso: 1,
  arms: 1,
  legs: 1,
}

export const proportionRange = { min: 0.7, max: 1.3, step: 0.05 } as const

export function clampProportion(value: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.min(proportionRange.max, Math.max(proportionRange.min, value))
}
