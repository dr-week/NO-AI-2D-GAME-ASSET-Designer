import type { CharacterPose, JointId } from './skeleton'

const mirroredJoints: readonly (readonly [JointId, JointId])[] = [
  ['shoulderL', 'shoulderR'], ['elbowL', 'elbowR'], ['wristL', 'wristR'],
  ['hipL', 'hipR'], ['kneeL', 'kneeR'], ['ankleL', 'ankleR'],
]
const centerlineJoints: readonly JointId[] = ['spine', 'neck', 'head']

export function mirrorCharacterPose(pose: CharacterPose): CharacterPose {
  const mirrored = { ...pose }
  for (const joint of centerlineJoints) mirrored[joint] = -(pose[joint] ?? 0)
  for (const [left, right] of mirroredJoints) {
    mirrored[left] = -(pose[right] ?? 0)
    mirrored[right] = -(pose[left] ?? 0)
  }
  return mirrored
}
