export const characterDecisionValues = {
  very_small: 0.7,
  small: 0.85,
  balanced: 1,
  large: 1.15,
  very_large: 1.3,
} as const

export type CharacterDecisionValue = keyof typeof characterDecisionValues
export type CharacterDecisionKey =
  | 'headSize' | 'torsoWidth' | 'armWidth' | 'legWidth'
  | 'torsoLength' | 'upperArmLength' | 'forearmLength' | 'thighLength' | 'lowerLegLength'

type ChoiceQuestion = {
  type: 'choice'
  instructions: string
  criteria: Record<CharacterDecisionValue, string>
}

const sizeCriteria = {
  very_small: 'Much smaller or narrower than the normal character proportion',
  small: 'A little smaller or narrower than the normal character proportion',
  balanced: 'Keep the normal character proportion',
  large: 'A little larger or wider than the normal character proportion',
  very_large: 'Much larger or wider than the normal character proportion',
}

const lengthCriteria = {
  very_small: 'Much shorter than the normal character proportion',
  small: 'A little shorter than the normal character proportion',
  balanced: 'Keep the normal character proportion',
  large: 'A little longer than the normal character proportion',
  very_large: 'Much longer than the normal character proportion',
}

export const characterDecisionQuestions: Record<CharacterDecisionKey, ChoiceQuestion> = {
  headSize: { type: 'choice', instructions: 'Choose the requested head size.', criteria: sizeCriteria },
  torsoWidth: { type: 'choice', instructions: 'Choose the requested torso width.', criteria: sizeCriteria },
  armWidth: { type: 'choice', instructions: 'Choose the requested arm width.', criteria: sizeCriteria },
  legWidth: { type: 'choice', instructions: 'Choose the requested leg width.', criteria: sizeCriteria },
  torsoLength: { type: 'choice', instructions: 'Choose the requested torso length.', criteria: lengthCriteria },
  upperArmLength: { type: 'choice', instructions: 'Choose the requested upper-arm length.', criteria: lengthCriteria },
  forearmLength: { type: 'choice', instructions: 'Choose the requested forearm length.', criteria: lengthCriteria },
  thighLength: { type: 'choice', instructions: 'Choose the requested thigh length.', criteria: lengthCriteria },
  lowerLegLength: { type: 'choice', instructions: 'Choose the requested lower-leg length.', criteria: lengthCriteria },
}
