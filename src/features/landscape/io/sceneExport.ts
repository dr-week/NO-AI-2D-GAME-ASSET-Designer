import { downloadBlob } from '../../../platform/download.ts'
import { defaultComposition } from '../model/compositions.ts'
import { generateLandscape, type LandscapeScene } from '../model/scene.ts'

export function landscapeSvgFileName(scene: LandscapeScene): string {
  const environment = scene.environment ?? 'temperate'
  const composition = scene.composition ?? defaultComposition(scene.preset, environment)
  const lighting = scene.lighting ?? 'golden-hour'
  const theme = scene.theme ?? 'contemporary'
  const material = scene.material ?? 'flat'
  const loop = scene.materialLoop ? '-loop' : ''
  return `landscape-${scene.preset}-${environment}-${composition}-${lighting}-${theme}-${scene.palette}-${material}-${scene.seed}${loop}.svg`
}

export function downloadLandscapeSvg(scene: LandscapeScene): void {
  const svg = generateLandscape(scene)
  downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), landscapeSvgFileName(scene))
}
