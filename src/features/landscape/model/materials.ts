import { createSeededRandom } from '../../../lib/random.ts'

export type LandscapeMaterial = 'flat' | 'grain' | 'ripple'

export const landscapeMaterials: Record<LandscapeMaterial, string> = {
  flat: 'Flat',
  grain: 'Grain',
  ripple: 'Ripple',
}

type MaterialColors = { light: string; dark: string }

export function renderMaterialPattern(material: LandscapeMaterial, seed: number, colors: MaterialColors, loop: boolean) {
  if (material === 'flat') return ''

  const rand = createSeededRandom(seed ^ (material === 'grain' ? 0x51ed270b : 0x2c1b3c6d))
  const tile = material === 'grain' ? 40 : 96
  const marks = material === 'grain'
    ? Array.from({ length: 12 }, () => {
        const x = (rand() * tile).toFixed(1)
        const y = (rand() * tile).toFixed(1)
        const radius = (0.8 + rand() * 1.8).toFixed(1)
        return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${rand() > 0.55 ? colors.light : colors.dark}" opacity=".42"/>`
      }).join('')
    : Array.from({ length: 4 }, (_, index) => {
        const y = 12 + index * 24 + Math.round(rand() * 8)
        const bend = Math.round(rand() * 14 - 7)
        const left = (tile * 0.125).toFixed(1)
        const firstMid = (tile * 0.375).toFixed(1)
        const secondMid = (tile * 0.625).toFixed(1)
        const right = (tile * 0.875).toFixed(1)
        return `<path d="M0 ${y} C${left} ${y - bend} ${firstMid} ${y - bend} ${tile / 2} ${y} C${secondMid} ${y + bend} ${right} ${y + bend} ${tile} ${y}" fill="none" stroke="${index % 2 ? colors.light : colors.dark}" stroke-width="2" opacity=".35"/>`
      }).join('')
  const animation = loop
    ? `<animateTransform id="scene-material-motion" attributeName="patternTransform" type="translate" from="0 0" to="${tile} 0" dur="8s" repeatCount="indefinite"/><style>@media (prefers-reduced-motion: reduce){#scene-material-motion{display:none}}</style>`
    : ''

  return `<pattern id="scene-material" width="${tile}" height="${tile}" patternUnits="userSpaceOnUse">${marks}${animation}</pattern>`
}
