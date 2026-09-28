import { proportionRange } from './proportions'
import type { JointId, Skeleton } from './skeleton'

export type BoneLengthGroup = 'torso' | 'upperArm' | 'forearm' | 'thigh' | 'lowerLeg'
export type BoneLengthScales = Record<BoneLengthGroup, number>

type BoneLengthControl = { id: BoneLengthGroup; label: string; joints: readonly JointId[] }

export const boneLengthControls = [
  { id: 'torso', label: 'Torso length', joints: ['spine'] },
  { id: 'upperArm', label: 'Upper arm length', joints: ['elbowL', 'elbowR'] },
  { id: 'forearm', label: 'Forearm length', joints: ['wristL', 'wristR'] },
  { id: 'thigh', label: 'Thigh length', joints: ['kneeL', 'kneeR'] },
  { id: 'lowerLeg', label: 'Lower leg length', joints: ['ankleL', 'ankleR'] },
] as const satisfies readonly BoneLengthControl[]

export const defaultBoneLengthScales: BoneLengthScales = {
  torso: 1,
  upperArm: 1,
  forearm: 1,
  thigh: 1,
  lowerLeg: 1,
}

export function applyBoneLengthScales(skeleton: Skeleton, scales: BoneLengthScales): Skeleton {
  const joints = { ...skeleton.joints }

  for (const control of boneLengthControls) {
    const scale = scales[control.id]
    if (!Number.isFinite(scale) || scale < proportionRange.min || scale > proportionRange.max) {
      throw new Error(`Bone scale ${control.id} must be between ${proportionRange.min} and ${proportionRange.max}.`)
    }
    for (const id of control.joints) {
      const joint = skeleton.joints[id]
      if (!joint || joint.boneLength === null) throw new Error(`Joint ${id} has no scalable bone.`)
      joints[id] = { ...joint, boneLength: joint.boneLength * scale }
    }
  }

  return { ...skeleton, joints }
}
