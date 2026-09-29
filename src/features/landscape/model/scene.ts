import { renderMaterialPattern, type LandscapeMaterial } from './materials.ts'
import { createSeededRandom } from '../../../lib/random.ts'
import type { LandscapeThemeId } from './themes.ts'
import { renderThemeAccents } from './themeArtwork.ts'
import { landscapeEnvironments, type LandscapeEnvironment } from './environments.ts'
import { landscapeLighting, renderSky, type LandscapeLighting } from './lighting.ts'
import { renderEnvironmentArtwork } from './environmentArtwork.ts'
import { defaultComposition, renderComposition, type LandscapeComposition, type LandscapePreset } from './compositions.ts'

export type LandscapePalette = 'dusk' | 'moss' | 'sakura'
export { defaultComposition, isLandscapeCompositionValid, landscapeCompositionsFor, landscapePresets, landscapeCompositions } from './compositions.ts'
export type { LandscapeComposition, LandscapePreset } from './compositions.ts'

export const landscapePalettes: Record<LandscapePalette, string> = {
  dusk: 'Warm',
  moss: 'Botanical',
  sakura: 'Blush',
}

export { landscapeEnvironments, landscapeLighting }
export type { LandscapeEnvironment, LandscapeLighting }

export type LandscapeScene = {
  preset: LandscapePreset
  composition?: LandscapeComposition
  palette: LandscapePalette
  seed: number
  environment?: LandscapeEnvironment
  lighting?: LandscapeLighting
  theme?: LandscapeThemeId
  material?: LandscapeMaterial
  materialLoop?: boolean
}

const paletteAccents: Record<LandscapePalette, string> = { dusk: '#f0b68d', moss: '#d9e1cf', sakura: '#e6a9b1' }

export function generateLandscape(scene: LandscapeScene) {
  const rand = createSeededRandom(scene.seed)
  const environment = scene.environment ?? 'temperate'
  const lighting = scene.lighting ?? 'golden-hour'
  const colors = landscapeEnvironments[environment]
  const accent = paletteAccents[scene.palette]
  const theme = scene.theme ?? 'contemporary'
  const composition = scene.composition ?? defaultComposition(scene.preset, environment)
  const form = renderComposition(composition, scene.preset, rand, colors)

  const material = renderMaterialPattern(scene.material ?? 'flat', scene.seed, { light: accent, dark: '#101820' }, scene.materialLoop ?? false)
  const materialOverlay = material ? `<path d="${form.nearPath}" fill="url(#scene-material)" opacity=".42"/>` : ''
  const themedAccents = renderThemeAccents(theme, scene.seed, scene.preset)
  const environmentArtwork = renderEnvironmentArtwork(environment, scene.seed, scene.preset, composition)
  const sky = renderSky(lighting, environment, scene.seed, accent)
  const farLayer = form.farPath ? `<path d="${form.farPath}" fill="${colors.far}" opacity=".82"/>` : ''
  const middleLayer = form.middlePath ? `<path d="${form.middlePath}" fill="${colors.mid}"/>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 680" role="img" aria-label="${landscapeEnvironments[environment].label}, ${landscapeLighting[lighting]} ${scene.preset} landscape">
<defs>${material}</defs>${sky}
${form.background}${farLayer}${middleLayer}
<path d="${form.nearPath}" fill="${colors.near}"/>${materialOverlay}<path d="${form.nearPath}" fill="${accent}" opacity=".055"/>${form.water}${form.landmarks}${environmentArtwork}${themedAccents}</svg>`
}
