import { createSeededRandom } from '../../../lib/random.ts'
import type { LandscapeComposition, LandscapePreset } from './compositions.ts'
import type { LandscapeEnvironment } from './environments.ts'
import { landscapeEnvironments } from './environments.ts'

export function renderEnvironmentArtwork(environment: LandscapeEnvironment, seed: number, preset: LandscapePreset, composition: LandscapeComposition = 'panorama'): string {
  const random = createSeededRandom(seed ^ 0x454e5631)
  const profile = landscapeEnvironments[environment]
  const ground = composition === 'overlook' ? 650 : preset === 'coast' ? 590 : preset === 'mountain' ? 565 : 570
  const anchors = composition === 'canyon' ? [35, 95, 1105, 1165] : composition === 'island' ? [92, 1080] : [72, 154, 256, 944, 1050, 1140]
  const plants = environment === 'temperate' ? renderTemperateForest(random, ground, profile.near, profile.mid, anchors)
    : environment === 'desert' ? renderCacti(random, ground, profile.detail, anchors)
    : environment === 'tropical' ? renderPalms(random, ground, profile.detail, anchors)
      : environment === 'alpine' ? renderPines(random, ground, profile.detail, true, anchors)
        : environment === 'arctic' ? renderIce(random, ground, profile.detail, anchors)
          : environment === 'alien' ? renderSpires(random, ground, profile.detail, anchors)
            : renderPines(random, ground, profile.detail, false, anchors)
  return `<g aria-hidden="true" stroke-linejoin="round" stroke-linecap="round">${composition === 'overlook' ? renderRockFraming(profile.detail) : ''}${plants}</g>`
}

function positions(random: () => number, anchors = [72, 154, 256, 944, 1050, 1140]) {
  return anchors.map((x) => x + Math.round(random() * 28 - 14))
}

function renderRockFraming(color: string) {
  return `<path d="M0 680V480Q45 380 110 445L170 680ZM1200 680V470Q1145 365 1085 440L1030 680Z" fill="${color}" opacity=".75"/>`
}

function renderTemperateForest(random: () => number, ground: number, shadow: string, canopy: string, anchors: number[]) {
  return positions(random, anchors).map((x, index) => {
    const scale = index === 2 || index === 3 ? 1 : 0.58 + random() * 0.2
    const height = Math.round((92 + random() * 52) * scale)
    const width = height * (0.38 + random() * 0.12)
    const top = ground - height
    const color = index % 2 ? shadow : canopy
    const trunk = `<path d="M${x} ${ground}q${width * .08} -${height * .35} 0 -${height * .61}" stroke="#493f38" stroke-width="${Math.max(3, width * .09).toFixed(1)}" fill="none"/>`
    const crown = index % 3 === 1
      ? `<path data-biome-prop="conifer" d="M${x} ${top}C${x - width * .12} ${top + height * .14} ${x - width * .7} ${top + height * .24} ${x - width * .52} ${top + height * .36}C${x - width * .9} ${top + height * .48} ${x - width * .42} ${top + height * .58} ${x - width * .34} ${top + height * .66}C${x - width * .67} ${top + height * .75} ${x - width * .2} ${ground - height * .12} ${x} ${ground - height * .08}C${x + width * .2} ${ground - height * .12} ${x + width * .67} ${top + height * .75} ${x + width * .34} ${top + height * .66}C${x + width * .42} ${top + height * .58} ${x + width * .9} ${top + height * .48} ${x + width * .52} ${top + height * .36}C${x + width * .7} ${top + height * .24} ${x + width * .12} ${top + height * .14} ${x} ${top}Z" fill="${color}"/>`
      : `<path data-biome-prop="broadleaf" d="M${x} ${ground}C${x - width * .3} ${ground - height * .12} ${x - width * .88} ${ground - height * .32} ${x - width * .66} ${top + height * .42}C${x - width * .9} ${top + height * .16} ${x - width * .48} ${top - height * .02} ${x - width * .2} ${top + height * .12}C${x - width * .06} ${top - height * .14} ${x + width * .34} ${top - height * .08} ${x + width * .38} ${top + height * .12}C${x + width * .82} ${top + height * .02} ${x + width * .9} ${top + height * .4} ${x + width * .63} ${top + height * .49}C${x + width * .8} ${ground - height * .2} ${x + width * .25} ${ground - height * .08} ${x} ${ground}Z" fill="${color}"/>`
    const lightEdge = `<path d="M${x - width * .45} ${top + height * .42}q${width * .12} -${height * .22} ${width * .38} -${height * .24}" fill="none" stroke="${canopy}" stroke-width="2" opacity=".48"/>`
    return `<g data-biome-x="${x}">${trunk}${crown}${lightEdge}</g>`
  }).join('')
}

function renderPines(random: () => number, ground: number, color: string, snow: boolean, anchors: number[]) {
  return positions(random, anchors).map((x) => {
    const height = 62 + Math.round(random() * 54)
    const width = height * 0.34
    const layers = [0.38, 0.64, 0.9].map((ratio) => {
      const y = ground - height * ratio
      const span = width * ratio
      const snowCap = snow ? `<path d="M${x} ${y - height * .16}l-${span * .22} ${height * .18}l${span * .22} -${height * .04}l${span * .22} ${height * .04}Z" fill="#f4f4e9"/>` : ''
      return `<path d="M${x} ${y - height * .16}L${x - span} ${y + height * .12}H${x + span}Z" fill="${color}"/>${snowCap}`
    }).join('')
    return `<path d="M${x} ${ground}v-${height * .18}" stroke="#493f38" stroke-width="5"/>${layers}`
  }).join('')
}

function renderCacti(random: () => number, ground: number, color: string, anchors: number[]) {
  return positions(random, anchors).map((x) => {
    const height = 28 + Math.round(random() * 30)
    return `<g fill="none" stroke="${color}" stroke-width="7"><path d="M${x} ${ground}v-${height}q0 -8 7 -8t7 8v9 M${x + 7} ${ground - height + 8}v-8q0 -7 7 -7"/></g><ellipse cx="${x}" cy="${ground + 3}" rx="15" ry="4" fill="#322e30" opacity=".28"/>`
  }).join('')
}

function renderPalms(random: () => number, ground: number, color: string, anchors: number[]) {
  return positions(random, anchors).map((x) => {
    const height = 64 + Math.round(random() * 38)
    const top = ground - height
    const fronds = Array.from({ length: 5 }, (_, index) => {
      const angle = -155 + index * 38
      return `<path d="M${x} ${top}q${Math.round(Math.cos(angle * Math.PI / 180) * 30)} ${Math.round(Math.sin(angle * Math.PI / 180) * 15)} ${Math.round(Math.cos(angle * Math.PI / 180) * 51)} ${Math.round(Math.sin(angle * Math.PI / 180) * 21)}"/>`
    }).join('')
    return `<path d="M${x} ${ground}q8 -${height * .55} -2 -${height}" fill="none" stroke="#725541" stroke-width="6"/><g fill="none" stroke="${color}" stroke-width="5">${fronds}</g>`
  }).join('')
}

function renderIce(random: () => number, ground: number, color: string, anchors: number[]) {
  return positions(random, anchors).map((x) => {
    const height = 20 + Math.round(random() * 42)
    const width = 12 + Math.round(random() * 16)
    return `<path d="M${x - width} ${ground}l${width * .6} -${height * .68}l${width * .3} ${height * .2}l${width * .4} -${height * .52}l${width * .7} ${height}Z" fill="${color}" opacity=".88"/><path d="M${x - width * .1} ${ground - height * .5}l${width * .2} ${height * .15}l${width * .3} -${height * .36}" fill="none" stroke="#f5fbf5" stroke-width="2"/>`
  }).join('')
}

function renderSpires(random: () => number, ground: number, color: string, anchors: number[]) {
  return positions(random, anchors).map((x) => {
    const height = 40 + Math.round(random() * 62)
    const width = 10 + Math.round(random() * 18)
    return `<path d="M${x - width} ${ground}q${width} -${height * .48} ${width * .45} -${height}q${width * .35} ${height * .22} ${width * 1.2} ${height}Z" fill="${color}" opacity=".88"/><circle cx="${x + width * .28}" cy="${ground - height * .58}" r="3" fill="#fff1ba" opacity=".8"/>`
  }).join('')
}
