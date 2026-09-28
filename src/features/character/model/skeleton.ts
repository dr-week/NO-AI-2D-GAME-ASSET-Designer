export type JointId =
  | 'pelvis' | 'spine' | 'neck' | 'head'
  | 'shoulderL' | 'elbowL' | 'wristL' | 'shoulderR' | 'elbowR' | 'wristR'
  | 'hipL' | 'kneeL' | 'ankleL' | 'hipR' | 'kneeR' | 'ankleR'

export type Point = { x: number; y: number }

export type Joint = {
  parentId: JointId | null
  boneLength: number | null
  localRestAngle: number
  rotationLimit: readonly [minRadians: number, maxRadians: number]
}

export type Skeleton = {
  rootId: JointId
  rootPosition: Point
  joints: Record<JointId, Joint>
}

// Coordinates use SVG's y-down plane. Angles are radians from +x; positive turns clockwise.
// Each non-root local angle rotates its bone relative to its parent's incoming bone.
export const defaultFrontFacingTPose: Skeleton = {
  rootId: 'pelvis',
  rootPosition: { x: 540, y: 1100 },
  joints: {
    pelvis: { parentId: null, boneLength: null, localRestAngle: 0, rotationLimit: [0, 0] },
    spine: { parentId: 'pelvis', boneLength: 500, localRestAngle: -Math.PI / 2, rotationLimit: [-0.2, 0.2] },
    neck: { parentId: 'spine', boneLength: 100, localRestAngle: 0, rotationLimit: [-0.35, 0.35] },
    head: { parentId: 'neck', boneLength: 180, localRestAngle: 0, rotationLimit: [-0.4, 0.4] },
    shoulderL: { parentId: 'spine', boneLength: 90, localRestAngle: -Math.PI / 2, rotationLimit: [-0.8, 0.8] },
    elbowL: { parentId: 'shoulderL', boneLength: 200, localRestAngle: 0, rotationLimit: [-1.8, 1.8] },
    wristL: { parentId: 'elbowL', boneLength: 200, localRestAngle: 0, rotationLimit: [-0.8, 0.8] },
    shoulderR: { parentId: 'spine', boneLength: 90, localRestAngle: Math.PI / 2, rotationLimit: [-0.8, 0.8] },
    elbowR: { parentId: 'shoulderR', boneLength: 200, localRestAngle: 0, rotationLimit: [-1.8, 1.8] },
    wristR: { parentId: 'elbowR', boneLength: 200, localRestAngle: 0, rotationLimit: [-0.8, 0.8] },
    hipL: { parentId: 'pelvis', boneLength: 70, localRestAngle: (Math.PI * 2) / 3, rotationLimit: [-0.6, 0.6] },
    kneeL: { parentId: 'hipL', boneLength: 430, localRestAngle: -Math.PI / 6, rotationLimit: [-1.2, 1.2] },
    ankleL: { parentId: 'kneeL', boneLength: 330, localRestAngle: 0, rotationLimit: [-0.5, 0.5] },
    hipR: { parentId: 'pelvis', boneLength: 70, localRestAngle: Math.PI / 3, rotationLimit: [-0.6, 0.6] },
    kneeR: { parentId: 'hipR', boneLength: 430, localRestAngle: Math.PI / 6, rotationLimit: [-1.2, 1.2] },
    ankleR: { parentId: 'kneeR', boneLength: 330, localRestAngle: 0, rotationLimit: [-0.5, 0.5] },
  },
}
