import { defaultMotionDuration } from '../../animation/themeEngine'
import type { Layer } from './types'

export function motionLayerChanges(motion: Layer['motion']): Pick<Layer, 'motion' | 'duration'> {
  return { motion, duration: defaultMotionDuration(motion) }
}
