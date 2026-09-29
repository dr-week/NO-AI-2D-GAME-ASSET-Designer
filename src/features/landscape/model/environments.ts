export type LandscapeEnvironment = 'temperate' | 'desert' | 'tropical' | 'alpine' | 'arctic' | 'alien'

export type EnvironmentProfile = {
  label: string
  description: string
  far: string
  mid: string
  near: string
  water: string
  detail: string
  light: string
}

export const landscapeEnvironments: Record<LandscapeEnvironment, EnvironmentProfile> = {
  temperate: { label: 'Temperate valley', description: 'Layered wooded foothills and open ground.', far: '#728d91', mid: '#496b63', near: '#294c43', water: '#4d7b83', detail: '#c8b77b', light: '#f4d69a' },
  desert: { label: 'Desert', description: 'Dry mesas, warm dunes, and sparse succulents.', far: '#ba8a69', mid: '#a86d50', near: '#784b3d', water: '#557b83', detail: '#e6bb79', light: '#ffe0a0' },
  tropical: { label: 'Tropical coast', description: 'Dense foliage, humid air, and coastal water.', far: '#65948b', mid: '#34776c', near: '#1c554e', water: '#308c91', detail: '#e7cf83', light: '#ffe39c' },
  alpine: { label: 'Alpine', description: 'High ridgelines, cool rock, and snow highlights.', far: '#9aaab2', mid: '#687d88', near: '#435b66', water: '#6e9ca7', detail: '#d9e6e7', light: '#fff2ce' },
  arctic: { label: 'Arctic', description: 'Open tundra, ice forms, and pale cold light.', far: '#93b5ba', mid: '#668f98', near: '#416b78', water: '#72aeb5', detail: '#e3f0e8', light: '#f2f7e9' },
  alien: { label: 'Alien world', description: 'Unfamiliar terrain, mineral color, and a ringed world.', far: '#967eae', mid: '#695582', near: '#453657', water: '#496984', detail: '#c9a9ec', light: '#f3c7ff' },
}

export function isLandscapeEnvironment(value: unknown): value is LandscapeEnvironment {
  return typeof value === 'string' && Object.hasOwn(landscapeEnvironments, value)
}
