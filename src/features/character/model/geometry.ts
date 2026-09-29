import type { JointId, Point, Skeleton } from './skeleton'

export type ResolvedJoint = Point & { angle: number }
export type ResolvedSkeleton = Record<JointId, ResolvedJoint>
export type Viewport = { width: number; height: number }
export type FitTransform = { scale: number; x: number; y: number }

export function resolveSkeleton(skeleton: Skeleton, pose: Partial<Record<JointId, number>> = {}): ResolvedSkeleton {
  const joints = skeleton.joints as Partial<Skeleton['joints']>
  if (!Number.isFinite(skeleton.rootPosition.x) || !Number.isFinite(skeleton.rootPosition.y)) {
    throw new Error('Root position must contain finite coordinates.')
  }
  if (!joints[skeleton.rootId] || joints[skeleton.rootId]?.parentId !== null) {
    throw new Error('Skeleton root must exist and have no parent.')
  }

  const resolved: Partial<ResolvedSkeleton> = {}
  const visiting = new Set<JointId>()

  function visit(id: JointId): ResolvedJoint {
    const cached = resolved[id]
    if (cached) return cached
    const joint = joints[id]
    if (!joint) throw new Error(`Missing joint: ${id}.`)
    if (visiting.has(id)) throw new Error(`Skeleton contains a cycle at ${id}.`)
    if (!Number.isFinite(joint.localRestAngle)) throw new Error(`Invalid angle at ${id}.`)
    const [minRotation, maxRotation] = joint.rotationLimit
    const poseRotation = pose[id] ?? 0
    if (![minRotation, maxRotation, poseRotation].every(Number.isFinite) || minRotation > maxRotation) {
      throw new Error(`Invalid rotation limit at ${id}.`)
    }
    if (poseRotation < minRotation || poseRotation > maxRotation) throw new Error(`Rotation at ${id} exceeds its limits.`)

    if (id === skeleton.rootId) {
      visiting.add(id)
      const root = { ...skeleton.rootPosition, angle: joint.localRestAngle + poseRotation }
      resolved[id] = root
      visiting.delete(id)
      return root
    }

    if (!joint.parentId || !joints[joint.parentId]) throw new Error(`Missing parent for ${id}.`)
    if (!Number.isFinite(joint.boneLength) || joint.boneLength === null || joint.boneLength <= 0) {
      throw new Error(`Bone length for ${id} must be finite and positive.`)
    }

    visiting.add(id)
    const parent = visit(joint.parentId)
    const angle = parent.angle + joint.localRestAngle + poseRotation
    const result = {
      x: parent.x + Math.cos(angle) * joint.boneLength,
      y: parent.y + Math.sin(angle) * joint.boneLength,
      angle,
    }
    if (!Number.isFinite(result.x) || !Number.isFinite(result.y)) throw new Error(`Invalid position at ${id}.`)
    resolved[id] = result
    visiting.delete(id)
    return result
  }

  for (const id of Object.keys(joints) as JointId[]) visit(id)
  return resolved as ResolvedSkeleton
}

// Fits joint centers uniformly to a viewport. Padding also leaves room for the head outline.
export function fitSkeleton(joints: ResolvedSkeleton, viewport: Viewport, padding = 130): FitTransform {
  if (![viewport.width, viewport.height, padding].every(Number.isFinite) || viewport.width <= 0 || viewport.height <= 0 || padding < 0) {
    throw new Error('Viewport dimensions must be positive and padding cannot be negative.')
  }
  const points = Object.values(joints)
  if (points.length === 0) throw new Error('Cannot fit an empty skeleton.')
  const xs = points.map(({ x }) => x)
  const ys = points.map(({ y }) => y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const width = maxX - minX || 1
  const height = maxY - minY || 1
  const scale = Math.min((viewport.width - padding * 2) / width, (viewport.height - padding * 2) / height)
  if (!Number.isFinite(scale) || scale <= 0) throw new Error('Padding leaves no room for the skeleton.')
  return {
    scale,
    x: (viewport.width - width * scale) / 2 - minX * scale,
    y: (viewport.height - height * scale) / 2 - minY * scale,
  }
}
