import type { Point } from './types'

export const maxColorTolerance = 100

export function getColorMaskDimensions(width: number, height: number, maxEdge: number): { width: number; height: number } {
  if (![width, height, maxEdge].every(Number.isFinite) || width < 1 || height < 1 || maxEdge < 1) {
    throw new Error('Color selection image size is invalid.')
  }
  const scale = Math.min(1, maxEdge / Math.max(width, height))
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

export function mapColorMaskPoint(point: Point, sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number) {
  return {
    x: Math.max(0, Math.min(targetWidth - 1, Math.floor(point.x * targetWidth / sourceWidth))),
    y: Math.max(0, Math.min(targetHeight - 1, Math.floor(point.y * targetHeight / sourceHeight))),
  }
}

export function applyColorMaskPixels(data: Uint8ClampedArray, width: number, height: number, x: number, y: number, tolerance: number) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || data.length !== width * height * 4) {
    throw new Error('Color selection image data is invalid.')
  }
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= width || y >= height) {
    throw new Error('Choose a point inside the image.')
  }
  if (!Number.isFinite(tolerance) || tolerance < 0 || tolerance > maxColorTolerance) {
    throw new Error(`Color tolerance must be between 0 and ${maxColorTolerance}.`)
  }

  const seed = (y * width + x) * 4
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
    const currentX = index % width
    for (let direction = 0; direction < 4; direction++) {
      if ((direction === 0 && currentX === 0) || (direction === 1 && currentX === width - 1)) continue
      const next = direction === 0 ? index - 1 : direction === 1 ? index + 1 : direction === 2 ? index - width : index + width
      if (next < 0 || next >= width * height || visited[next]) continue
      visited[next] = 2
      const nextOffset = next * 4
      if (data[nextOffset + 3] < 8) continue
      const red = data[nextOffset] - seedR
      const green = data[nextOffset + 1] - seedG
      const blue = data[nextOffset + 2] - seedB
      if (red * red + green * green + blue * blue <= toleranceSquared) {
        visited[next] = 1
        queue[tail++] = next
      }
    }
  }

  for (let index = 0; index < visited.length; index++) {
    const offset = index * 4
    const value = visited[index] === 1 ? 255 : 0
    data[offset] = data[offset + 1] = data[offset + 2] = data[offset + 3] = value
  }
}
