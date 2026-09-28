import { createRidgePath, createRidgePoints } from './ridge.ts'
import type { LandscapeEnvironment, EnvironmentProfile } from './environments.ts'

export type LandscapePreset = 'coast' | 'hills' | 'mountain'
export type LandscapeComposition = 'panorama' | 'valley' | 'overlook' | 'island' | 'canyon' | 'dunes'

export const landscapePresets: Record<LandscapePreset, string> = {
  coast: 'Coast', hills: 'Hills', mountain: 'Mountain',
}

export const landscapeCompositions: Record<LandscapeComposition, string> = {
  panorama: 'Open panorama', valley: 'Framed valley', overlook: 'High overlook',
  island: 'Island chain', canyon: 'Canyon passage', dunes: 'Dune sweep',
}

export function isLandscapeComposition(value: unknown): value is LandscapeComposition {
  return typeof value === 'string' && Object.hasOwn(landscapeCompositions, value)
}

export function defaultComposition(preset: LandscapePreset, environment: LandscapeEnvironment): LandscapeComposition {
  return landscapeCompositionsFor(preset, environment)[0]
}

export function landscapeCompositionsFor(preset: LandscapePreset, environment: LandscapeEnvironment): LandscapeComposition[] {
  if (environment === 'desert') return ['dunes', 'canyon', 'panorama']
  if (environment === 'alien') return ['overlook', 'canyon', 'panorama']
  if (environment === 'alpine' || environment === 'arctic') return ['valley', 'overlook', 'panorama']
  if (preset === 'coast') return ['island', 'panorama', 'overlook']
  if (preset === 'mountain') return ['valley', 'canyon', 'overlook']
  return ['panorama', 'valley', 'overlook']
}

export function isLandscapeCompositionValid(value: unknown, preset: LandscapePreset, environment: LandscapeEnvironment): value is LandscapeComposition {
  return isLandscapeComposition(value) && landscapeCompositionsFor(preset, environment).includes(value)
}

export function renderComposition(
  composition: LandscapeComposition,
  preset: LandscapePreset,
  random: () => number,
  colors: EnvironmentProfile,
) {
  const terrain = composition === 'dunes' ? 'hills' : composition === 'canyon' ? 'mountain' : preset
  const base = terrain === 'coast' ? 410 : terrain === 'mountain' ? 310 : 365
  const variance = terrain === 'mountain' ? 180 : terrain === 'hills' ? 110 : 76
  const farPoints = createRidgePoints(random, base - (composition === 'valley' ? 30 : 0), variance)
  if (composition === 'valley') farPoints.forEach((point, index) => { point.y += Math.abs(index - 6) * 12 })
  const farPath = createRidgePath(farPoints)
  const middlePath = createRidgePath(createRidgePoints(random, base + 75, variance * 0.7))
  const nearPath = createRidgePath(createRidgePoints(random, base + 160, variance * 0.48))
  let background = ''
  let water = ''
  let landmarks = ''

  if (composition === 'overlook') {
    background = '<path d="M0 520V350L220 210 410 365 590 185 790 365 1010 230 1200 390V680H0Z" fill="#101820" opacity=".84"/>'
    landmarks = `<path d="M0 560Q260 455 520 545T1200 520V680H0Z" fill="${colors.near}"/><path d="M0 605Q260 500 520 590T1200 565" fill="none" stroke="${colors.detail}" stroke-width="3" opacity=".65"/>`
  } else if (composition === 'canyon') {
    background = `<path d="M0 0H215L310 390 0 505ZM1200 0H995L890 390 1200 505Z" fill="${colors.near}"/><path d="M0 0H105L220 370 0 450ZM1200 0H1095L980 370 1200 450Z" fill="${colors.detail}" opacity=".38"/>`
    landmarks = '<path d="M420 430L600 380 780 430 900 680H300Z" fill="#101820" opacity=".18"/>'
  } else if (composition === 'island') {
    water = `<path d="M0 435Q300 390 600 430T1200 420V680H0Z" fill="${colors.water}"/><path d="M0 500Q300 455 600 495T1200 485M0 565Q300 520 600 560T1200 550" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="3"/>`
    landmarks = [210, 520, 870].map((x, index) => `<path d="M${x - 110} ${430 + index * 5}q55 -${80 + index * 12} 110 -35q70 -35 132 35Z" fill="${index === 1 ? colors.mid : colors.far}"/><path d="M${x - 40} ${397 - index * 3}l40 -${50 + index * 8} 42 ${50 + index * 8}Z" fill="${colors.detail}" opacity=".85"/>`).join('')
  } else if (composition === 'dunes') {
    background = `<path d="M0 350Q280 245 520 360T1200 300V680H0Z" fill="${colors.far}"/><path d="M0 450Q300 340 610 455T1200 400V680H0Z" fill="${colors.mid}"/>`
    landmarks = `<path d="M0 610Q350 480 700 600T1200 530" fill="none" stroke="${colors.detail}" stroke-width="5" opacity=".45"/>`
  } else if (composition === 'valley') {
    landmarks = `<path d="M490 430Q600 390 710 430L840 680H360Z" fill="${colors.detail}" opacity=".42"/>`
  } else {
    landmarks = `<path d="M0 510L180 380 360 505 610 345 820 505 1020 370 1200 500V680H0Z" fill="${colors.far}" opacity=".56"/>`
  }
  const customLayout = composition === 'overlook' || composition === 'canyon' || composition === 'dunes'
  return { background, water, landmarks, farPath: customLayout ? '' : farPath, middlePath: customLayout ? '' : middlePath, nearPath }
}
