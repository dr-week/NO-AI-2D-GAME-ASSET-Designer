type Point = { x: number; y: number }

function smoothstep(value: number) {
  return value * value * (3 - 2 * value)
}

export function createRidgePoints(rand: () => number, base: number, variance: number): Point[] {
  const anchors = Array.from({ length: 5 }, () => (rand() - 0.5) * variance)
  return Array.from({ length: 13 }, (_, index) => {
    const x = index * 100
    const anchorPosition = (x / 1200) * (anchors.length - 1)
    const anchorIndex = Math.min(Math.floor(anchorPosition), anchors.length - 2)
    const blend = smoothstep(anchorPosition - anchorIndex)
    const coarse = anchors[anchorIndex] + (anchors[anchorIndex + 1] - anchors[anchorIndex]) * blend
    const detail = (rand() - 0.5) * variance * 0.12
    return { x, y: base + coarse + detail }
  })
}

export function createRidgePath(points: Point[]) {
  if (points.length < 2) throw new Error('A ridge needs at least two points.')
  const curves = points.slice(0, -1).map((point, index) => {
    const next = points[index + 1]
    const previousY = points[Math.max(0, index - 1)].y
    const followingY = points[Math.min(points.length - 1, index + 2)].y
    const firstControlY = point.y + (next.y - previousY) / 6
    const secondControlY = next.y - (followingY - point.y) / 6
    return `C${(point.x + (next.x - point.x) / 3).toFixed(1)} ${firstControlY.toFixed(1)} ${(next.x - (next.x - point.x) / 3).toFixed(1)} ${secondControlY.toFixed(1)} ${next.x} ${next.y.toFixed(1)}`
  })
  return `M${points[0].x} ${points[0].y.toFixed(1)} ${curves.join(' ')} L1200 680 L0 680 Z`
}
