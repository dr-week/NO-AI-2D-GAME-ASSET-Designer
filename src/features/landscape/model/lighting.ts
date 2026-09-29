import { createSeededRandom } from '../../../lib/random.ts'
import { landscapeEnvironments, type LandscapeEnvironment } from './environments.ts'

export type LandscapeLighting = 'morning' | 'day' | 'golden-hour' | 'night'

export const landscapeLighting: Record<LandscapeLighting, string> = {
  morning: 'Morning',
  day: 'Daylight',
  'golden-hour': 'Golden hour',
  night: 'Night',
}

const skies: Record<LandscapeLighting, { top: string; horizon: string; body: string; bodyY: number }> = {
  morning: { top: '#6689a5', horizon: '#e8b99b', body: '#ffe4af', bodyY: 260 },
  day: { top: '#4482a8', horizon: '#cde0d4', body: '#fff0b2', bodyY: 145 },
  'golden-hour': { top: '#513e64', horizon: '#e59270', body: '#ffd18b', bodyY: 360 },
  night: { top: '#101a32', horizon: '#29334d', body: '#e7eced', bodyY: 142 },
}

export function renderSky(lighting: LandscapeLighting, environment: LandscapeEnvironment, seed: number, accent: string): string {
  const sky = skies[lighting]
  const profile = landscapeEnvironments[environment]
  const random = createSeededRandom(seed ^ 0x534b5931)
  const stars = lighting === 'night' ? renderNightSky(random, profile.light, environment) : ''
  const clouds = lighting === 'night' ? '' : Array.from({ length: lighting === 'day' ? 4 : 3 }, (_, index) => {
    const x = 140 + random() * 850
    const y = 85 + random() * 170
    const scale = 0.7 + random() * 0.65
    return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${scale.toFixed(2)})" fill="#fff8ee" opacity="${lighting === 'day' ? '.24' : '.16'}"><ellipse cx="${index * 250}" cy="0" rx="57" ry="13"/><circle cx="${index * 250 - 21}" cy="-6" r="17"/><circle cx="${index * 250 + 4}" cy="-12" r="23"/><circle cx="${index * 250 + 29}" cy="-5" r="16"/></g>`
  }).join('')
  const body = environment === 'alien'
    ? `<g data-sky-feature="ringed-world" transform="translate(884 ${sky.bodyY})"><ellipse rx="75" ry="23" fill="none" stroke="${profile.light}" stroke-width="7" opacity=".8"/><circle r="43" fill="${profile.detail}"/><ellipse rx="75" ry="23" fill="none" stroke="${profile.light}" stroke-width="3"/>${lighting === 'night' ? `<circle data-sky-feature="orbiting-moon" cx="-102" cy="58" r="11" fill="#e7eced" opacity=".9"/>` : ''}</g>`
    : lighting === 'night'
      ? renderMoon(random, sky.body)
      : `<circle cx="880" cy="${sky.bodyY}" r="${lighting === 'day' ? 47 : 54}" fill="${accent || sky.body}" opacity=".94"/>`
  const glow = lighting === 'night' ? '' : `<circle cx="880" cy="${sky.bodyY}" r="82" fill="${sky.body}" opacity=".11"/>`
  return `<defs><linearGradient id="scene-sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="680"><stop stop-color="${sky.top}"/><stop offset="1" stop-color="${sky.horizon}"/></linearGradient></defs><rect width="1200" height="680" fill="url(#scene-sky)"/>${stars}${clouds}${glow}${body}`
}

function renderNightSky(random: () => number, starColor: string, environment: LandscapeEnvironment): string {
  const field = Array.from({ length: 34 }, () => {
    const x = Math.round(random() * 1200)
    const y = Math.round(random() * 350)
    const radius = (0.6 + random() * 0.8).toFixed(1)
    const opacity = (0.3 + random() * 0.42).toFixed(2)
    return `<circle data-sky-feature="star" cx="${x}" cy="${y}" r="${radius}" fill="#fff7df" opacity="${opacity}"/>`
  }).join('')
  const formations = [
    { x: 160, y: 86, points: [[0, 0], [27, 31], [63, 13], [91, 55]] },
    { x: 485, y: 170, points: [[0, 22], [36, 0], [72, 39], [101, 12]] },
    { x: 1030, y: 72, points: [[0, 15], [25, 50], [59, 4], [93, 35]] },
  ]
  const constellations = formations.map(({ x, y, points }) => {
    const coordinates = points.map(([dx, dy]) => [x + dx + Math.round(random() * 8 - 4), y + dy + Math.round(random() * 8 - 4)])
    const line = coordinates.map(([px, py]) => `${px},${py}`).join(' ')
    const stars = coordinates.map(([px, py], index) => `<circle cx="${px}" cy="${py}" r="${index === 0 ? 2.3 : 1.5}" fill="#fffaf0"/>`).join('')
    return `<g data-sky-feature="constellation"><polyline points="${line}" fill="none" stroke="${starColor}" stroke-width="1" opacity=".22"/>${stars}</g>`
  }).join('')
  const aurora = environment === 'arctic'
    ? `<path data-sky-feature="aurora" d="M0 210Q220 95 450 185T900 150T1200 190" fill="none" stroke="${starColor}" stroke-width="38" opacity=".09"/>`
    : environment === 'alien'
      ? `<path data-sky-feature="nebula" d="M0 260Q230 95 510 215T910 165T1200 220" fill="none" stroke="${landscapeEnvironments.alien.detail}" stroke-width="58" opacity=".08"/>`
      : ''
  return `${aurora}${field}${constellations}`
}

function renderMoon(random: () => number, color: string): string {
  const x = 820 + Math.round(random() * 230)
  const y = 92 + Math.round(random() * 135)
  const radius = 30 + Math.round(random() * 15)
  const phase = Math.floor(random() * 4)
  const direction = random() > 0.5 ? 1 : -1
  const offset = [radius * 1.35, radius * 0.94, radius * 0.48, 0][phase] * direction
  const shadow = phase === 3 ? '' : `<circle cx="${x + offset}" cy="${y}" r="${radius * .92}" fill="url(#scene-sky)"/>`
  return `<g data-sky-feature="moon" data-moon-phase="${['crescent', 'quarter', 'gibbous', 'full'][phase]}"><circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity=".94"/>${shadow}<circle cx="${x - radius * .35}" cy="${y - radius * .28}" r="${radius * .09}" fill="#bfc8d0" opacity=".35"/></g>`
}
