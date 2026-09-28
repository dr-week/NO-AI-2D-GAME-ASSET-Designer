import type { Point } from './types'

const maxMaskEdge = 1024

export function createColorMask(source: HTMLImageElement, point: Point, tolerance: number): string {
  const scale = Math.min(1, maxMaskEdge / Math.max(source.naturalWidth, source.naturalHeight))
  const width = Math.max(1, Math.round(source.naturalWidth * scale))
  const height = Math.max(1, Math.round(source.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Color selection is unavailable in this browser.')

  context.drawImage(source, 0, 0, width, height)
  const pixels = context.getImageData(0, 0, width, height)
  const mask = context.createImageData(width, height)
  const x = Math.max(0, Math.min(width - 1, Math.floor(point.x * width / source.naturalWidth)))
  const y = Math.max(0, Math.min(height - 1, Math.floor(point.y * height / source.naturalHeight)))
  const seed = (y * width + x) * 4
  const data = pixels.data
  if (data[seed + 3] < 8) throw new Error('Choose a visible color region.')

  const toleranceSquared = tolerance * tolerance
  const visited = new Uint8Array(width * height)
  const queue = new Uint32Array(width * height)
  const seedR = data[seed], seedG = data[seed + 1], seedB = data[seed + 2]
  let head = 0, tail = 0
  const seedIndex = y * width + x
  queue[tail++] = seedIndex
  visited[seedIndex] = 1

  while (head < tail) {
    const index = queue[head++]
    const offset = index * 4
    mask.data[offset] = mask.data[offset + 1] = mask.data[offset + 2] = mask.data[offset + 3] = 255
    const currentX = index % width
    for (let direction = 0; direction < 4; direction++) {
      if ((direction === 0 && currentX === 0) || (direction === 1 && currentX === width - 1)) continue
      const next = direction === 0 ? index - 1 : direction === 1 ? index + 1 : direction === 2 ? index - width : index + width
      if (next < 0 || next >= width * height || visited[next]) continue
      visited[next] = 1
      const nextOffset = next * 4
      if (data[nextOffset + 3] < 8) continue
      const red = data[nextOffset] - seedR
      const green = data[nextOffset + 1] - seedG
      const blue = data[nextOffset + 2] - seedB
      if (red * red + green * green + blue * blue <= toleranceSquared) queue[tail++] = next
    }
  }

  context.putImageData(mask, 0, 0)
  return canvas.toDataURL('image/png')
}
