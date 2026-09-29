import type { JointId } from './skeleton'
import type { CharacterPose } from './skeleton'

export type CharacterKeyframe = {
  at: number
  pose: CharacterPose
}

export type CharacterMotionClip = {
  id: string
  name: string
  duration: number
  keyframes: CharacterKeyframe[]
}

export const characterMotionClips: Record<string, CharacterMotionClip> = {
  breathe: {
    id: 'breathe',
    name: 'Breathe',
    duration: 2.8,
    keyframes: [
      { at: 0, pose: { spine: 0, neck: 0, head: 0, shoulderL: 0, shoulderR: 0 } },
      { at: 0.5, pose: { spine: 0.045, neck: -0.025, head: 0.015, shoulderL: 0.025, shoulderR: -0.025 } },
      { at: 1, pose: { spine: 0, neck: 0, head: 0, shoulderL: 0, shoulderR: 0 } },
    ],
  },
  reach: {
    id: 'reach',
    name: 'Reach',
    duration: 1.7,
    keyframes: [
      { at: 0, pose: { shoulderR: 0, elbowR: 0, wristR: 0 } },
      { at: 0.2, pose: { shoulderR: -0.08, elbowR: 0.18, wristR: -0.04 } },
      { at: 0.68, pose: { shoulderR: 0.3, elbowR: -0.5, wristR: 0.18 } },
      { at: 0.82, pose: { shoulderR: 0.34, elbowR: -0.62, wristR: 0.25 } },
      { at: 1, pose: { shoulderR: 0, elbowR: 0, wristR: 0 } },
    ],
  },
  wave: {
    id: 'wave',
    name: 'Wave',
    duration: 1.6,
    keyframes: [
      { at: 0, pose: { shoulderR: -0.55, elbowR: -1.35, wristR: -0.15 } },
      { at: 0.25, pose: { shoulderR: -0.55, elbowR: -1.7, wristR: 0.2 } },
      { at: 0.5, pose: { shoulderR: -0.55, elbowR: -1.35, wristR: -0.15 } },
      { at: 0.75, pose: { shoulderR: -0.55, elbowR: -1.7, wristR: 0.2 } },
      { at: 1, pose: { shoulderR: -0.55, elbowR: -1.35, wristR: -0.15 } },
    ],
  },
}

function smoothStep(value: number) {
  return value * value * (3 - 2 * value)
}

export function sampleCharacterClip(
  clip: CharacterMotionClip,
  progress: number,
  basePose: CharacterPose = {},
): CharacterPose {
  if (!Number.isFinite(progress)) throw new Error('Animation progress must be finite.')
  if (!Number.isFinite(clip.duration) || clip.duration <= 0 || clip.keyframes.length < 2) throw new Error('Animation clip is invalid.')
  const keyframes = clip.keyframes
  const position = Math.max(0, Math.min(1, progress))
  if (position <= keyframes[0].at) return { ...basePose, ...keyframes[0].pose }
  if (position >= keyframes[keyframes.length - 1].at) return { ...basePose, ...keyframes[keyframes.length - 1].pose }
  let nextIndex = keyframes.findIndex((frame) => frame.at >= position)
  if (nextIndex < 0) nextIndex = keyframes.length - 1
  if (nextIndex === 0) return { ...basePose, ...keyframes[0].pose }

  const from = keyframes[nextIndex - 1]
  const to = keyframes[nextIndex]
  const span = to.at - from.at
  if (!Number.isFinite(from.at) || !Number.isFinite(to.at) || span <= 0) throw new Error('Animation keyframe times must increase.')
  const amount = smoothStep((position - from.at) / span)
  const joints = Object.keys(clip.keyframes[0].pose) as JointId[]
  const pose: CharacterPose = { ...basePose }

  for (const joint of joints) {
    const start = from.pose[joint] ?? basePose[joint] ?? 0
    const end = to.pose[joint] ?? basePose[joint] ?? 0
    pose[joint] = start + (end - start) * amount
  }

  return pose
}
