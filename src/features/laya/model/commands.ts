import { proportionRange, type CharacterProportions } from '../../character/model/proportions.ts'
import { defaultFrontFacingTPose, type JointId } from '../../character/model/skeleton.ts'
import type { BoneLengthGroup } from '../../character/model/boneLengths.ts'

type PoseableJoint = Extract<JointId, 'shoulderL' | 'elbowL' | 'shoulderR' | 'elbowR' | 'hipL' | 'kneeL' | 'hipR' | 'kneeR'>

export type LayaCommand =
  | { type: 'pose'; joint: PoseableJoint; degrees: number }
  | { type: 'proportion'; group: keyof CharacterProportions; scale: number }
  | { type: 'length'; group: BoneLengthGroup; scale: number }
  | { type: 'reset'; group: 'pose' | 'proportions' | 'lengths' }

const poseAliases: Record<string, PoseableJoint> = {
  'left shoulder': 'shoulderL', 'shoulder left': 'shoulderL', 'shoulder-left': 'shoulderL',
  'left elbow': 'elbowL', 'elbow left': 'elbowL', 'elbow-left': 'elbowL',
  'right shoulder': 'shoulderR', 'shoulder right': 'shoulderR', 'shoulder-right': 'shoulderR',
  'right elbow': 'elbowR', 'elbow right': 'elbowR', 'elbow-right': 'elbowR',
  'left hip': 'hipL', 'hip left': 'hipL', 'hip-left': 'hipL',
  'left knee': 'kneeL', 'knee left': 'kneeL', 'knee-left': 'kneeL',
  'right hip': 'hipR', 'hip right': 'hipR', 'hip-right': 'hipR',
  'right knee': 'kneeR', 'knee right': 'kneeR', 'knee-right': 'kneeR',
}

const proportionAliases: Record<string, keyof CharacterProportions> = {
  head: 'head', 'head size': 'head',
  torso: 'torso', 'torso width': 'torso',
  arms: 'arms', arm: 'arms', 'arm width': 'arms',
  legs: 'legs', leg: 'legs', 'leg width': 'legs',
}

const lengthAliases: Record<string, BoneLengthGroup> = {
  torso: 'torso', 'upper arm': 'upperArm', 'upper-arm': 'upperArm',
  forearm: 'forearm', thigh: 'thigh', 'lower leg': 'lowerLeg', 'lower-leg': 'lowerLeg',
}

const jointLabels: Record<PoseableJoint, string> = {
  shoulderL: 'left shoulder', elbowL: 'left elbow', shoulderR: 'right shoulder', elbowR: 'right elbow',
  hipL: 'left hip', kneeL: 'left knee', hipR: 'right hip', kneeR: 'right knee',
}

function readPercent(value: string): number {
  const match = value.match(/^(\d+(?:\.\d+)?)%$/)
  if (!match) throw new Error('Use a percentage such as 110%.')
  const percent = Number(match[1])
  const min = proportionRange.min * 100
  const max = proportionRange.max * 100
  if (percent < min || percent > max) throw new Error(`Value must be between ${min}% and ${max}%.`)
  return percent / 100
}

export function parseLayaCommand(input: string): LayaCommand {
  if (typeof input !== 'string') throw new Error('Enter a command as text.')
  const command = input.normalize('NFKC').replace(/[−﹣－]/g, '-').trim().toLowerCase().replace(/\s+/g, ' ')

  const reset = command.match(/^reset (pose|t-pose|proportions|lengths|bone lengths)$/)
  if (reset) {
    const group = reset[1] === 't-pose' ? 'pose' : reset[1] === 'bone lengths' ? 'lengths' : reset[1]
    return { type: 'reset', group: group as 'pose' | 'proportions' | 'lengths' }
  }

  const pose = command.match(/^pose (.+) (-?\d+(?:\.\d+)?)\s*(?:deg|degrees|°)?$/)
  if (pose) {
    const joint = Object.prototype.hasOwnProperty.call(poseAliases, pose[1]) ? poseAliases[pose[1]] : undefined
    if (!joint) throw new Error('Unknown joint. Use left/right shoulder, elbow, hip, or knee.')
    const degrees = Number(pose[2])
    if (!Number.isFinite(degrees)) throw new Error('Pose angle must be a finite number of degrees.')
    const [min, max] = defaultFrontFacingTPose.joints[joint].rotationLimit
    const minDegrees = min * 180 / Math.PI
    const maxDegrees = max * 180 / Math.PI
    if (degrees < minDegrees || degrees > maxDegrees) {
      throw new Error(`${jointLabels[joint]} angle must be between ${Math.ceil(minDegrees)}° and ${Math.floor(maxDegrees)}°.`)
    }
    return { type: 'pose', joint, degrees }
  }

  const proportion = command.match(/^proportion (.+) (\S+)$/)
  if (proportion) {
    const group = Object.prototype.hasOwnProperty.call(proportionAliases, proportion[1]) ? proportionAliases[proportion[1]] : undefined
    if (!group) throw new Error('Unknown proportion. Use head, torso, arms, or legs.')
    return { type: 'proportion', group, scale: readPercent(proportion[2]) }
  }

  const length = command.match(/^length (.+) (\S+)$/)
  if (length) {
    const group = Object.prototype.hasOwnProperty.call(lengthAliases, length[1]) ? lengthAliases[length[1]] : undefined
    if (!group) throw new Error('Unknown length. Use torso, upper arm, forearm, thigh, or lower leg.')
    return { type: 'length', group, scale: readPercent(length[2]) }
  }

  throw new Error('Command not recognized. Try “pose left elbow 45°”, “proportion head 110%”, “length upper arm 110%”, or “reset pose”.')
}

export function describeLayaCommand(command: LayaCommand): string {
  const readable = (value: string) => value.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)
  switch (command.type) {
    case 'pose': return `${jointLabels[command.joint]} set to ${command.degrees}°`
    case 'proportion': return `${readable(command.group)} proportion set to ${Math.round(command.scale * 100)}%`
    case 'length': return `${readable(command.group)} length set to ${Math.round(command.scale * 100)}%`
    case 'reset': return `${command.group} reset`
  }
}
