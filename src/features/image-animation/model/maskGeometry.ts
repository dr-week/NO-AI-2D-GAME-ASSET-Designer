import type { Point } from './types'

export function getMaskCenter(points: Point[]) {
  const xs = points.map(({ x }) => x)
  const ys = points.map(({ y }) => y)
  return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 }
}
