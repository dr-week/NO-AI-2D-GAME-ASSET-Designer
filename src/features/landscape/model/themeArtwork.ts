import { createSeededRandom } from '../../../lib/random.ts'
import type { LandscapeThemeId } from './themes.ts'
import type { LandscapePreset } from './scene.ts'

export function renderThemeAccents(theme: LandscapeThemeId, seed: number, preset: LandscapePreset): string {
  if (theme === 'contemporary') return ''
  const random = createSeededRandom(seed ^ (theme === 'warli-inspired' ? 0x5741524c : 0x4d495448))
  const top = preset === 'mountain' ? 560 : preset === 'hills' ? 590 : 610
  return theme === 'warli-inspired' ? renderGeometry(random, top) : renderBotanical(random, top)
}

function renderGeometry(random: () => number, top: number): string {
  const marks = Array.from({ length: 13 }, (_, index) => {
    const x = 35 + index * 94 + Math.round(random() * 25)
    const y = top + Math.round(random() * 38)
    const size = 6 + Math.round(random() * 7)
    const shape = index % 3
    if (shape === 0) return `<path d="M${x} ${y}l${size} ${size * 1.5}h-${size * 2}z"/>`
    if (shape === 1) return `<rect x="${x - size}" y="${y}" width="${size * 2}" height="${size * 2}"/>`
    return `<circle cx="${x}" cy="${y}" r="${size / 2}"/>`
  }).join('')
  return `<g fill="#fff0da" stroke="#fff0da" stroke-width="2" opacity=".82">${marks}</g>`
}

function renderBotanical(random: () => number, top: number): string {
  const marks = Array.from({ length: 10 }, (_, index) => {
    const x = 48 + index * 112 + Math.round(random() * 16)
    const y = top + 10 + Math.round(random() * 28)
    const height = 12 + Math.round(random() * 9)
    const color = index % 2 ? '#f3cf8a' : '#fff0da'
    return `<g fill="none" stroke="${color}" stroke-width="2" opacity=".82"><path d="M${x - 14} ${y}q14 -${height} 28 0 M${x} ${y}v${height}"/><path d="M${x} ${y - 2}q-13 -${height} -15 -2q10 8 15 2 M${x} ${y - 2}q13 -${height} 15 -2q-10 8 -15 2"/></g>`
  }).join('')
  return `<g>${marks}</g>`
}
