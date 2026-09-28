import { createSeededRandom } from '../../../lib/random'
import { proportionRange, type CharacterProportions } from './proportions'
import type { BoneLengthScales } from './boneLengths'
import { poseJointControls, type CharacterPose, type Skeleton } from './skeleton'

const proportionGroups: (keyof CharacterProportions)[] = ['head', 'torso', 'arms', 'legs']
const boneGroups: (keyof BoneLengthScales)[] = ['torso', 'upperArm', 'forearm', 'thigh', 'lowerLeg']

function randomScale(random: () => number) {
  const steps = Math.round((proportionRange.max - proportionRange.min) / proportionRange.step)
  return Number((proportionRange.min + Math.floor(random() * (steps + 1)) * proportionRange.step).toFixed(2))
}

export function createRandomCharacter(skeleton: Skeleton, seed: number) {
  const random = createSeededRandom(seed)
  const pose = randomPose(skeleton, random)
  const proportions = Object.fromEntries(proportionGroups.map((group) => [group, randomScale(random)])) as CharacterProportions
  const boneScales = Object.fromEntries(boneGroups.map((group) => [group, randomScale(random)])) as BoneLengthScales
  return { pose, proportions, boneScales }
}

export function createRandomPose(skeleton: Skeleton, seed: number): CharacterPose {
  return randomPose(skeleton, createSeededRandom(seed))
}

function randomPose(skeleton: Skeleton, random: () => number): CharacterPose {
  const pose: CharacterPose = {}
  for (const { id } of poseJointControls) {
    const [min, max] = skeleton.joints[id].rotationLimit
    const center = (min + max) / 2
    const radius = (max - min) * 0.28
    pose[id] = center + (random() * 2 - 1) * radius
  }
  return pose
}
