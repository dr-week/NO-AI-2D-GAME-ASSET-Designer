import { backgroundMotionDuration, motionDefinitions } from '../../animation/themeEngine'
import type { Motion } from '../model/types'
import type { ImageProject } from './projectFile'
import { downloadBlob } from '../../../platform/download'

const svgNs = 'http://www.w3.org/2000/svg'

export function exportAnimatedSvg(project: ImageProject): void {
  const { width, height, imageDataUrl, layers, backgroundMotion } = project
  const svg = document.createElementNS(svgNs, 'svg')
  svg.setAttribute('xmlns', svgNs)
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  const defs = document.createElementNS(svgNs, 'defs')
  svg.append(defs)

  const makeImage = (href: string) => {
    const image = document.createElementNS(svgNs, 'image')
    image.setAttribute('href', href)
    image.setAttribute('width', String(width))
    image.setAttribute('height', String(height))
    return image
  }

  function addMotion(target: SVGElement, motion: Motion, duration: number) {
    const definition = motionDefinitions[motion]
    const transform = definition.transform
    if (transform) {
      const element = document.createElementNS(svgNs, 'animateTransform')
      const durationSeconds = duration * (transform.alternate ? 2 : 1)
      element.setAttribute('attributeName', 'transform')
      element.setAttribute('type', transform.type)
      element.setAttribute('dur', `${durationSeconds}s`)
      element.setAttribute('repeatCount', transform.repeat ? 'indefinite' : '1')
      element.setAttribute('calcMode', 'spline')
      element.setAttribute('keyTimes', transform.alternate ? '0;0.5;1' : '0;1')
      element.setAttribute('values', transform.alternate ? `${transform.from};${transform.to};${transform.from}` : `${transform.from};${transform.to}`)
      element.setAttribute('keySplines', transform.alternate ? '0.2 0 0 1;0.2 0 0 1' : '0.2 0 0 1')
      element.setAttribute('additive', 'sum')
      target.append(element)
    }
    if (definition.opacity) {
      const element = document.createElementNS(svgNs, 'animate')
      element.setAttribute('attributeName', 'opacity')
      element.setAttribute('from', String(definition.opacity.from))
      element.setAttribute('to', String(definition.opacity.to))
      element.setAttribute('dur', `${duration}s`)
      element.setAttribute('repeatCount', transform?.repeat ? 'indefinite' : '1')
      element.setAttribute('calcMode', 'spline')
      element.setAttribute('keySplines', '0.2 0 0 1')
      target.append(element)
    }
  }

  const background = document.createElementNS(svgNs, 'g')
  addMotion(background, backgroundMotion, backgroundMotionDuration)
  background.append(makeImage(imageDataUrl))
  svg.append(background)

  for (const layer of layers) {
    const pivotX = layer.kind === 'text' ? layer.x : layer.maskUrl ? width / 2 : (Math.min(...layer.points.map(({ x }) => x)) + Math.max(...layer.points.map(({ x }) => x))) / 2
    const pivotY = layer.kind === 'text' ? layer.y : layer.maskUrl ? height / 2 : (Math.min(...layer.points.map(({ y }) => y)) + Math.max(...layer.points.map(({ y }) => y))) / 2
    const pivot = document.createElementNS(svgNs, 'g')
    pivot.setAttribute('transform', `translate(${pivotX} ${pivotY})`)
    const animated = document.createElementNS(svgNs, 'g')
    addMotion(animated, layer.motion, layer.duration)

    if (layer.kind === 'text') {
      const text = document.createElementNS(svgNs, 'text')
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('dominant-baseline', 'middle')
      text.setAttribute('font-family', 'system-ui, sans-serif')
      text.setAttribute('font-size', String(layer.fontSize))
      text.setAttribute('fill', layer.fill)
      text.textContent = layer.text
      animated.append(text)
    } else {
      const reference = `${layer.maskUrl ? 'mask' : 'clip'}-${layer.id}`
      if (layer.maskUrl) {
        const mask = document.createElementNS(svgNs, 'mask')
        mask.setAttribute('id', reference)
        mask.setAttribute('maskUnits', 'userSpaceOnUse')
        mask.append(makeImage(layer.maskUrl))
        defs.append(mask)
        animated.setAttribute('mask', `url(#${reference})`)
      } else {
        const clip = document.createElementNS(svgNs, 'clipPath')
        clip.setAttribute('id', reference)
        clip.setAttribute('clipPathUnits', 'userSpaceOnUse')
        const polygon = document.createElementNS(svgNs, 'polygon')
        polygon.setAttribute('points', layer.points.map(({ x, y }) => `${x},${y}`).join(' '))
        clip.append(polygon)
        defs.append(clip)
        animated.setAttribute('clip-path', `url(#${reference})`)
      }
      const restore = document.createElementNS(svgNs, 'g')
      restore.setAttribute('transform', `translate(${-pivotX} ${-pivotY})`)
      restore.append(makeImage(imageDataUrl))
      animated.append(restore)
    }
    pivot.append(animated)
    svg.append(pivot)
  }

  downloadBlob(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }), '2dmaker-animation.svg')
}
