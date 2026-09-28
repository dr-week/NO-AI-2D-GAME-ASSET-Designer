import { renderMaterialPattern, type LandscapeMaterial } from './materials.ts'
import { createRidgePath, createRidgePoints } from './ridge.ts'
import { createSeededRandom } from '../../../lib/random.ts'
import { landscapeThemes, type LandscapeThemeId } from './themes.ts'
import { renderThemeAccents } from './themeArtwork.ts'

export type LandscapePreset = 'coast' | 'hills' | 'mountain'
export type LandscapePalette = 'dusk' | 'moss' | 'sakura'

export const landscapePresets: Record<LandscapePreset, string> = {
  coast: 'Coast',
  hills: 'Hills',
  mountain: 'Mountain',
}

export const landscapePalettes: Record<LandscapePalette, string> = {
  dusk: 'Dusk',
  moss: 'Moss',
  sakura: 'Sakura',
}

export type LandscapeScene = {
  preset: LandscapePreset
  palette: LandscapePalette
  seed: number
  theme?: LandscapeThemeId
  material?: LandscapeMaterial
  materialLoop?: boolean
}

const palettes = {
  dusk: { sky: '#182c3d', far: '#48616b', mid: '#294953', near: '#172f38', sun: '#f0b68d', water: '#203e4a' },
  moss: { sky: '#d9e1cf', far: '#91a58a', mid: '#667d64', near: '#405b4b', sun: '#e3b47c', water: '#78958a' },
  sakura: { sky: '#f0d9d2', far: '#d49b94', mid: '#a66969', near: '#744c58', sun: '#f1c695', water: '#a9c2bd' },
} as const

export function generateLandscape(scene: LandscapeScene) {
  const rand = createSeededRandom(scene.seed)
  const colors = palettes[scene.palette]
  const theme = scene.theme ?? 'contemporary'
  const landBase = scene.preset === 'coast' ? 415 : scene.preset === 'mountain' ? 290 : 360
  const farVariance = scene.preset === 'mountain' ? 180 : 75
  const farPath = createRidgePath(createRidgePoints(rand, landBase, farVariance))
  const middlePath = createRidgePath(createRidgePoints(rand, landBase + 100, scene.preset === 'hills' ? 90 : 55))
  const nearPath = createRidgePath(createRidgePoints(rand, landBase + 185, scene.preset === 'coast' ? 75 : 45))
  const details = Array.from({ length: 22 }, () => {
    const x = Math.round(rand() * 1200)
    const y = Math.round(400 + rand() * 200)
    const radius = (3 + rand() * 8).toFixed(1)
    const fill = rand() > 0.55 ? colors.far : colors.near
    return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" opacity=".45"/>`
  }).join('')
  const horizon = scene.preset === 'coast'
    ? `<path d="M0 415 Q260 395 520 420 T1000 410 T1200 418 V680 H0Z" fill="${colors.water}"/><path d="M80 478 Q210 464 330 480 M650 510 Q810 494 970 509" fill="none" stroke="#ffffff" stroke-opacity=".24" stroke-width="3"/>`
    : ''

  const material = renderMaterialPattern(scene.material ?? 'flat', scene.seed, { light: '#ffffff', dark: '#101820' }, scene.materialLoop ?? false)
  const materialOverlay = material ? `<path d="${nearPath}" fill="url(#scene-material)" opacity=".42"/>` : ''
  const themedAccents = renderThemeAccents(theme, scene.seed, scene.preset)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 680" role="img" aria-label="Generated ${landscapeThemes[theme].name} ${scene.preset} landscape">
<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${colors.sky}"/><stop offset="1" stop-color="${scene.palette === 'dusk' ? '#c69580' : '#fff0da'}"/></linearGradient>${material}</defs>
<rect width="1200" height="680" fill="url(#sky)"/><circle cx="880" cy="152" r="54" fill="${colors.sun}" opacity=".92"/>
<path d="${farPath}" fill="${colors.far}" opacity=".8"/><path d="${middlePath}" fill="${colors.mid}"/>
${horizon}<path d="${nearPath}" fill="${colors.near}"/>${materialOverlay}${details}${themedAccents}</svg>`
}
