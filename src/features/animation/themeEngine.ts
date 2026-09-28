export type MotionPreset = 'still' | 'float' | 'drift' | 'pulse' | 'fade' | 'rise' | 'rotate' | 'scaleIn' | 'sharedAxisX' | 'sharedAxisY'

export type MotionDefinition = {
  name: string
  description: string
  transform?: { type: 'translate' | 'scale' | 'rotate'; from: string; to: string; alternate: boolean; repeat: boolean }
  opacity?: { from: number; to: number }
}

export const backgroundMotionDuration = 8

export const motionDefinitions: Record<MotionPreset, MotionDefinition> = {
  still: { name: 'Still', description: 'Keep this layer still.' },
  float: { name: 'Float', description: 'Gently move up and down.', transform: { type: 'translate', from: '0 0', to: '0 -10', alternate: true, repeat: true } },
  drift: { name: 'Drift', description: 'Move gently across two directions.', transform: { type: 'translate', from: '0 0', to: '10 -4', alternate: true, repeat: true } },
  pulse: { name: 'Pulse', description: 'Grow and return to the original size.', transform: { type: 'scale', from: '1', to: '1.025', alternate: true, repeat: true } },
  fade: { name: 'Fade', description: 'Fade into view once.', opacity: { from: 0, to: 1 } },
  rise: { name: 'Rise', description: 'Move up into place once.', transform: { type: 'translate', from: '0 14', to: '0 0', alternate: false, repeat: false }, opacity: { from: 0, to: 1 } },
  rotate: { name: 'Rotate', description: 'Rock gently around the layer pivot.', transform: { type: 'rotate', from: '-5', to: '5', alternate: true, repeat: true } },
  scaleIn: { name: 'Scale in', description: 'Fade and grow into place.', transform: { type: 'scale', from: '0.92', to: '1', alternate: false, repeat: false }, opacity: { from: 0, to: 1 } },
  sharedAxisX: { name: 'Shared axis · X', description: 'Fade and slide horizontally into place.', transform: { type: 'translate', from: '24 0', to: '0 0', alternate: false, repeat: false }, opacity: { from: 0, to: 1 } },
  sharedAxisY: { name: 'Shared axis · Y', description: 'Fade and slide vertically into place.', transform: { type: 'translate', from: '0 24', to: '0 0', alternate: false, repeat: false }, opacity: { from: 0, to: 1 } },
}

export function motionStyle(motion: MotionPreset, durationSeconds: number): string {
  const definition = motionDefinitions[motion]
  const transform = definition.transform
  return [
    `--cycle:${durationSeconds}s`,
    `--motion-from:${cssTransform(transform?.type, transform?.from)}`,
    `--motion-to:${cssTransform(transform?.type, transform?.to)}`,
    `--motion-direction:${transform?.alternate ? 'alternate' : 'normal'}`,
    `--motion-iterations:${transform?.repeat ? 'infinite' : '1'}`,
    `--opacity-from:${definition.opacity?.from ?? 1}`,
    `--opacity-to:${definition.opacity?.to ?? 1}`,
  ].join(';')
}

function cssTransform(type: 'translate' | 'scale' | 'rotate' | undefined, value: string | undefined): string {
  if (!type || value === undefined) return 'none'
  if (type === 'translate') {
    const [x, y] = value.split(/\s+/)
    return `translate(${x}px, ${y}px)`
  }
  return type === 'rotate' ? `rotate(${value}deg)` : `scale(${value})`
}

export type AnimationTemplate = {
  id: string
  name: string
  description: string
  category: AnimationCategory
  motion: Exclude<MotionPreset, 'still'>
  durationMs: readonly [min: number, max: number]
}

export type AnimationCategory = 'Calm' | 'Playful' | 'Entrance' | 'Transition'

export const animationTemplates = {
  breathe: { id: 'breathe', name: 'Breathe', description: 'A calm float for a layer.', category: 'Calm', motion: 'float', durationMs: [2400, 3600] },
  wave: { id: 'wave', name: 'Drift', description: 'A gentle diagonal drift.', category: 'Calm', motion: 'drift', durationMs: [4000, 8000] },
  arcadeBounce: { id: 'arcade-bounce', name: 'Pulse', description: 'A subtle scale pulse.', category: 'Playful', motion: 'pulse', durationMs: [2000, 5000] },
  fadeIn: { id: 'fade-in', name: 'Fade in', description: 'Fade into view with a short, calm entrance.', category: 'Entrance', motion: 'fade', durationMs: [200, 400] },
  riseIn: { id: 'rise-in', name: 'Rise in', description: 'Fade and rise into place.', category: 'Entrance', motion: 'rise', durationMs: [250, 450] },
  rock: { id: 'rock', name: 'Rock', description: 'Rotate gently around the layer pivot.', category: 'Playful', motion: 'rotate', durationMs: [1600, 2600] },
  scaleIn: { id: 'scale-in', name: 'Scale in', description: 'Fade and grow into place.', category: 'Entrance', motion: 'scaleIn', durationMs: [250, 450] },
  sharedAxisX: { id: 'shared-axis-x', name: 'Shared axis · X', description: 'A Material-inspired horizontal fade and slide.', category: 'Transition', motion: 'sharedAxisX', durationMs: [250, 400] },
  sharedAxisY: { id: 'shared-axis-y', name: 'Shared axis · Y', description: 'A Material-inspired vertical fade and slide.', category: 'Transition', motion: 'sharedAxisY', durationMs: [250, 400] },
} satisfies Record<string, AnimationTemplate>

export function defaultMotionDuration(motion: MotionPreset): number {
  const template = Object.values(animationTemplates).find((item) => item.motion === motion)
  if (!template) return 3
  const [min, max] = template.durationMs
  return Math.round((min + max) / 20) / 100
}

// Stable xorshift32: the same seed and inputs always produce the same variation.
function randomFromSeed(seed: number): () => number {
  let state = seed >>> 0 || 1
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return (state >>> 0) / 0x1_0000_0000
  }
}

export function createTemplateMotion(template: AnimationTemplate, seed: number) {
  if (!Number.isFinite(seed)) throw new Error('Animation seed must be finite.')
  const random = randomFromSeed(seed)
  const [min, max] = template.durationMs
  return {
    motion: template.motion,
    duration: Math.round((min + random() * (max - min)) / 10) / 100,
  }
}
