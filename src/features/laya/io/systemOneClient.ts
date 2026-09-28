import { characterProfiles, type CharacterProfileId } from '../model/characterProfiles.ts'
import { landscapeThemeCategories, landscapeThemes, type LandscapeThemeId } from '../../landscape/model/themes.ts'

type RecordValue = Record<string, unknown>

function isRecord(value: unknown): value is RecordValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function chooseFromCatalog<Id extends string>(
  brief: string,
  key: string,
  category: string,
  instructions: string,
  criteria: Record<Id, string>,
): Promise<Id> {
  const text = brief.trim()
  if (!text) throw new Error('Describe the design before asking Laya.')
  if (text.length > 500) throw new Error('Keep the design brief under 500 characters.')

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 180_000)
  try {
    const response = await fetch('/api/laya/v1/systemone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        state: { brief: text, category },
        questions: {
          [key]: {
            type: 'choice',
            instructions,
            criteria,
          },
        },
      }),
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`Local Laya returned HTTP ${response.status}.`)

    const result: unknown = await response.json()
    if (!isRecord(result) || !isRecord(result.answers) || !isRecord(result.answers[key])) {
      throw new Error('Local Laya returned an incomplete decision.')
    }
    const answer = result.answers[key]
    const choice = answer.choice
    if (answer.type !== 'choice' || typeof choice !== 'string' || !Object.hasOwn(criteria, choice)) {
      throw new Error('Local Laya returned an unsupported option; no change was applied.')
    }
    const probabilities = answer.probabilities
    const probability = isRecord(probabilities) ? probabilities[choice] : undefined
    if (typeof probability !== 'number' || !Number.isFinite(probability) || probability < 0 || probability > 1) {
      throw new Error('Local Laya returned invalid confidence data; no change was applied.')
    }
    return choice as Id
  } catch (cause) {
    if (cause instanceof Error && cause.name === 'AbortError') throw new Error('Local Laya timed out. Keep using the manual controls or local rules.')
    throw cause
  } finally {
    window.clearTimeout(timeout)
  }
}

export function suggestCharacterProfile(brief: string): Promise<CharacterProfileId> {
  const criteria = Object.fromEntries(Object.values(characterProfiles).map(({ id, name, description }) => [id, `${name}: ${description}`])) as Record<CharacterProfileId, string>
  return chooseFromCatalog(
    brief, 'profile', '2D character body proportions',
    'Choose the closest bounded body-proportion profile. Do not infer clothing, identity, pose, or details outside these profiles.',
    criteria,
  )
}

export function suggestLandscapeTheme(brief: string): Promise<LandscapeThemeId> {
  const criteria = Object.fromEntries(Object.values(landscapeThemes).map((theme) => [
    theme.id,
    `${theme.name}. Category: ${landscapeThemeCategories[theme.category]}. Region: ${theme.region}. Tags: ${theme.tags.join(', ')}. ${theme.description} This is an inspiration profile, not an authentic reproduction.`,
  ])) as Record<LandscapeThemeId, string>
  return chooseFromCatalog(
    brief, 'style', '2D landscape art direction',
    'Choose the closest style profile from this catalog. Do not infer unavailable styles or claim cultural authenticity.',
    criteria,
  )
}
