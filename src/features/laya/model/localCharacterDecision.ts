import { characterConfigFromChoices, type CharacterDecisionConfig } from './characterDecision.ts'
import { characterDecisionValues, type CharacterDecisionKey, type CharacterDecisionValue } from './characterQuestions.ts'
import { characterProfiles, type CharacterProfileId } from './characterProfiles.ts'

export type LocalCharacterDecision =
  | { ok: true; config: CharacterDecisionConfig; profile: CharacterProfileId; matchedFeatures: number; matchedOverall: boolean }
  | { ok: false; reason: string }

const fields: Record<CharacterDecisionKey, { targets: string; small: string; large: string }> = {
  headSize: { targets: 'head|head size', small: 'small|tiny|petite|undersized', large: 'large|big|huge|giant|oversized' },
  torsoWidth: { targets: 'torso|chest', small: 'small|narrow|slim|thin', large: 'large|big|broad|wide|thick' },
  armWidth: { targets: 'arms?|upper arms?', small: 'small|narrow|slim|thin|skinny', large: 'large|big|broad|wide|thick|bulky|muscular' },
  legWidth: { targets: 'legs?|thighs?', small: 'small|narrow|slim|thin|skinny', large: 'large|big|broad|wide|thick|bulky|muscular' },
  torsoLength: { targets: 'torso|trunk', small: 'short|compact', large: 'long|elongated' },
  upperArmLength: { targets: 'upper arms?|arms?', small: 'short', large: 'long' },
  forearmLength: { targets: 'forearms?|lower arms?|arms?', small: 'short', large: 'long' },
  thighLength: { targets: 'thighs?', small: 'short', large: 'long' },
  lowerLegLength: { targets: 'lower legs?|calves', small: 'short', large: 'long' },
}

function mentions(text: string, adjectives: string, targets: string): boolean {
  const before = new RegExp(`\\b(?:${adjectives})\\b\\s+(?:[\\w-]+\\s+){0,2}(?:${targets})\\b`)
  const after = new RegExp(`\\b(?:${targets})\\b\\s+(?:is|are|with)?\\s*\\b(?:${adjectives})\\b`)
  const positive = (pattern: RegExp) => {
    const match = pattern.exec(text)
    if (!match) return false
    const prefix = text.slice(0, match.index)
    return !/\b(?:not|avoid|without|no|exclude|skip|do not|don't)(?:\s+(?:make|use|create|choose|a|an|the|very|too|much|slightly|any))*(?:\s+)?$/i.test(prefix)
  }
  return positive(before) || positive(after)
}

function mentionsAlias(text: string, alias: string): boolean {
  const pattern = new RegExp(`\\b${alias}\\b`, 'ig')
  for (const match of text.matchAll(pattern)) {
    const prefix = text.slice(0, match.index)
    if (!/\b(?:not|avoid|without|no|exclude|skip|do not|don't)(?:\s+(?:make|use|create|choose|a|an|the|very|too|much|slightly|any))*(?:\s+)?$/i.test(prefix)) return true
  }
  return false
}

function profileInBrief(text: string): CharacterProfileId | undefined {
  const matches = Object.values(characterProfiles).filter((profile) => profile.aliases.some((alias) => mentionsAlias(text, alias)))
  return matches.length === 1 ? matches[0].id : undefined
}

function choiceForScale(scale: number): CharacterDecisionValue {
  return (Object.entries(characterDecisionValues).find(([, value]) => value === scale)?.[0] ?? 'balanced') as CharacterDecisionValue
}

/** Map known brief cues to bounded presets. This is deterministic rules, not model inference. */
export function decideCharacterBrief(brief: string, selectedProfile: CharacterProfileId = 'balanced'): LocalCharacterDecision {
  if (typeof brief !== 'string' || brief.length > 500) return { ok: false, reason: 'Keep the design brief under 500 characters.' }
  const text = brief.normalize('NFKC').toLowerCase().trim()
  if (!text && selectedProfile === 'balanced') return { ok: false, reason: 'Choose a body profile or describe character features first.' }

  const namedProfile = profileInBrief(text)
  const includesProfileName = Object.values(characterProfiles).some((profile) => profile.aliases.some((alias) => mentionsAlias(text, alias)))
  if (!namedProfile && includesProfileName) return { ok: false, reason: 'Choose one body profile; the brief contains conflicting profile names.' }
  const profileId = namedProfile ?? selectedProfile
  const profile = characterProfiles[profileId]

  const overallSmall = mentions(text, 'small|tiny|petite|compact', '(?:whole\\s+)?character')
  const overallLarge = mentions(text, 'large|big|huge|giant|tall', '(?:whole\\s+)?character')
  const matchedOverall = overallSmall || overallLarge
  const choices = Object.fromEntries(Object.entries({
    headSize: profile.config.proportions.head,
    torsoWidth: profile.config.proportions.torso,
    armWidth: profile.config.proportions.arms,
    legWidth: profile.config.proportions.legs,
    torsoLength: profile.config.boneScales.torso,
    upperArmLength: profile.config.boneScales.upperArm,
    forearmLength: profile.config.boneScales.forearm,
    thighLength: profile.config.boneScales.thigh,
    lowerLegLength: profile.config.boneScales.lowerLeg,
  }).map(([key, scale]) => [key, choiceForScale(scale as number)])) as Record<CharacterDecisionKey, CharacterDecisionValue>
  let matchedFeatures = 0

  for (const [key, field] of Object.entries(fields) as [CharacterDecisionKey, typeof fields[CharacterDecisionKey]][]) {
    let choice: CharacterDecisionValue | undefined = overallSmall ? 'small' : overallLarge ? 'large' : undefined
    const smallCue = mentions(text, field.small, field.targets)
    const largeCue = mentions(text, field.large, field.targets)
    if (smallCue) {
      choice = 'small'
      matchedFeatures++
    } else if (largeCue) {
      choice = 'large'
      matchedFeatures++
    }
    if (choice) {
      choices[key] = choice
    }
  }

  if (profileId === 'balanced' && !matchedFeatures && !matchedOverall) return { ok: false, reason: 'Choose a body profile or add a cue such as “small head, broad torso, long arms”.' }
  return { ok: true, config: characterConfigFromChoices(choices), profile: profileId, matchedFeatures, matchedOverall }
}
