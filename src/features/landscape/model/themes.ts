export type LandscapeThemeId = 'contemporary' | 'warli-inspired' | 'mithila-inspired'
export type LandscapeThemeCategory = 'contemporary' | 'indian-folk-inspired'

export type LandscapeTheme = {
  id: LandscapeThemeId
  name: string
  category: LandscapeThemeCategory
  region: string
  tags: readonly string[]
  description: string
}

export const landscapeThemes: Record<LandscapeThemeId, LandscapeTheme> = {
  contemporary: {
    id: 'contemporary', name: 'Contemporary', category: 'contemporary', region: 'Global',
    tags: ['layered', 'minimal', 'landscape'], description: 'Clean layered scenery with restrained detail.',
  },
  'warli-inspired': {
    id: 'warli-inspired', name: 'Warli-inspired geometry', category: 'indian-folk-inspired', region: 'Maharashtra, India',
    tags: ['geometric', 'earthy', 'landscape'], description: 'Abstract terrain marks inspired by Warli geometric forms.',
  },
  'mithila-inspired': {
    id: 'mithila-inspired', name: 'Mithila-inspired botanicals', category: 'indian-folk-inspired', region: 'Mithila, Bihar',
    tags: ['botanical', 'patterned', 'landscape'], description: 'Nature-inspired line motifs informed by Mithila painting.',
  },
}

export const landscapeThemeCategories: Record<LandscapeThemeCategory, string> = {
  contemporary: 'Contemporary',
  'indian-folk-inspired': 'Indian folk-inspired',
}

export function isLandscapeThemeId(value: unknown): value is LandscapeThemeId {
  return typeof value === 'string' && Object.hasOwn(landscapeThemes, value)
}
