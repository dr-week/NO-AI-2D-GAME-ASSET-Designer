export type AnimationCategory = 'idle' | 'gesture' | 'retro'
export type Easing = 'linear' | 'easeInOut' | 'overshoot' | 'step'
export type MotionPreset = 'still' | 'float' | 'drift' | 'pulse' | 'fade' | 'rise' | 'rotate' | 'scaleIn' | 'sharedAxisX' | 'sharedAxisY'

export type MotionDefinition = {
  name: string
  description: string
  transform?: { type: 'translate' | 'scale' | 'rotate'; from: string; to: string; cssFrom: string; cssTo: string; alternate: boolean; repeat: boolean }
  opacity?: { from: number; to: number }
}

export const motionDefinitions: Record<MotionPreset, MotionDefinition> = {
  still: { name: 'Still', description: 'Keep this layer still.' },
  float: { name: 'Float', description: 'Gently move up and down.', transform: { type: 'translate', from: '0 0', to: '0 -10', cssFrom: 'translate(0, 0)', cssTo: 'translate(0, -10px)', alternate: true, repeat: true } },
  drift: { name: 'Drift', description: 'Move gently across two directions.', transform: { type: 'translate', from: '0 0', to: '10 -4', cssFrom: 'translate(0, 0)', cssTo: 'translate(10px, -4px)', alternate: true, repeat: true } },
  pulse: { name: 'Pulse', description: 'Grow and return to the original size.', transform: { type: 'scale', from: '1', to: '1.025', cssFrom: 'scale(1)', cssTo: 'scale(1.025)', alternate: true, repeat: true } },
  fade: { name: 'Fade', description: 'Fade into view once.', opacity: { from: 0, to: 1 } },
  rise: { name: 'Rise', description: 'Move up into place once.', transform: { type: 'translate', from: '0 14', to: '0 0', cssFrom: 'translate(0, 14px)', cssTo: 'translate(0, 0)', alternate: false, repeat: false }, opacity: { from: 0, to: 1 } },
  rotate: { name: 'Rotate', description: 'Rock gently around the layer pivot.', transform: { type: 'rotate', from: '-5', to: '5', cssFrom: 'rotate(-5deg)', cssTo: 'rotate(5deg)', alternate: true, repeat: true } },
  scaleIn: { name: 'Scale in', description: 'Fade and grow into place.', transform: { type: 'scale', from: '0.92', to: '1', cssFrom: 'scale(.92)', cssTo: 'scale(1)', alternate: false, repeat: false }, opacity: { from: 0, to: 1 } },
  sharedAxisX: { name: 'Shared axis · X', description: 'Fade and slide horizontally into place.', transform: { type: 'translate', from: '24 0', to: '0 0', cssFrom: 'translate(24px, 0)', cssTo: 'translate(0, 0)', alternate: false, repeat: false }, opacity: { from: 0, to: 1 } },
  sharedAxisY: { name: 'Shared axis · Y', description: 'Fade and slide vertically into place.', transform: { type: 'translate', from: '0 24', to: '0 0', cssFrom: 'translate(0, 24px)', cssTo: 'translate(0, 0)', alternate: false, repeat: false }, opacity: { from: 0, to: 1 } },
}

export function motionStyle(motion: MotionPreset, durationSeconds: number): string {
  const definition = motionDefinitions[motion]
  const transform = definition.transform
  return [
    `--cycle:${durationSeconds}s`,
    `--motion-from:${transform?.cssFrom ?? 'none'}`,
    `--motion-to:${transform?.cssTo ?? 'none'}`,
    `--motion-direction:${transform?.alternate ? 'alternate' : 'normal'}`,
    `--motion-iterations:${transform?.repeat ? 'infinite' : '1'}`,
    `--opacity-from:${definition.opacity?.from ?? 1}`,
    `--opacity-to:${definition.opacity?.to ?? 1}`,
  ].join(';')
}

export type AnimationTheme = {
  id: string
  name: string
  palette: { ink: string; accent: string; highlight: string; shadow: string }
  motion: {
    durationScale: number
    amplitudeScale: number
    easing: Record<AnimationCategory, Easing>
    stepCount: number
  }
}

export const animationThemes = {
  soft: {
    id: 'soft',
    name: 'Soft storybook',
    palette: { ink: '#343b4a', accent: '#e58b72', highlight: '#fff1c9', shadow: '#9b6372' },
    motion: { durationScale: 1.15, amplitudeScale: 0.8, easing: { idle: 'easeInOut', gesture: 'easeInOut', retro: 'linear' }, stepCount: 0 },
  },
  retro: {
    id: 'retro',
    name: 'Retro arcade',
    palette: { ink: '#17201d', accent: '#f0c84b', highlight: '#aac0ad', shadow: '#658c7b' },
    motion: { durationScale: 0.8, amplitudeScale: 1.15, easing: { idle: 'step', gesture: 'overshoot', retro: 'step' }, stepCount: 8 },
  },
} satisfies Record<string, AnimationTheme>

export type AnimationTemplate = {
  id: string
  name: string
  description: string
  category: AnimationCategory
  motion: Exclude<MotionPreset, 'still'>
  durationMs: readonly [min: number, max: number]
  amplitude: readonly [min: number, max: number]
  loops: boolean
}

export const animationTemplates = {
  breathe: { id: 'breathe', name: 'Breathe', description: 'A calm float for a layer.', category: 'idle', motion: 'float', durationMs: [2400, 3600], amplitude: [0, 0], loops: true },
  wave: { id: 'wave', name: 'Drift', description: 'A gentle diagonal drift.', category: 'gesture', motion: 'drift', durationMs: [4000, 8000], amplitude: [0, 0], loops: true },
  arcadeBounce: { id: 'arcade-bounce', name: 'Pulse', description: 'A subtle scale pulse.', category: 'retro', motion: 'pulse', durationMs: [2000, 5000], amplitude: [0, 0], loops: true },
  fadeIn: { id: 'fade-in', name: 'Fade in', description: 'Fade into view with a short, calm entrance.', category: 'idle', motion: 'fade', durationMs: [200, 400], amplitude: [0, 0], loops: false },
  riseIn: { id: 'rise-in', name: 'Rise in', description: 'Fade and rise into place.', category: 'gesture', motion: 'rise', durationMs: [250, 450], amplitude: [0, 0], loops: false },
  rock: { id: 'rock', name: 'Rock', description: 'Rotate gently around the layer pivot.', category: 'idle', motion: 'rotate', durationMs: [1600, 2600], amplitude: [0, 0], loops: true },
  scaleIn: { id: 'scale-in', name: 'Scale in', description: 'Fade and grow into place.', category: 'gesture', motion: 'scaleIn', durationMs: [250, 450], amplitude: [0, 0], loops: false },
  sharedAxisX: { id: 'shared-axis-x', name: 'Shared axis · X', description: 'A Material-inspired horizontal fade and slide.', category: 'gesture', motion: 'sharedAxisX', durationMs: [250, 400], amplitude: [0, 0], loops: false },
  sharedAxisY: { id: 'shared-axis-y', name: 'Shared axis · Y', description: 'A Material-inspired vertical fade and slide.', category: 'gesture', motion: 'sharedAxisY', durationMs: [250, 400], amplitude: [0, 0], loops: false },
} satisfies Record<string, AnimationTemplate>

export type AnimationVariant = {
  templateId: string
  themeId: string
  seed: number
  durationMs: number
  amplitude: number
  easing: Easing
  loops: boolean
}

export type AnimationThemeId = keyof typeof animationThemes

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

export function createAnimationVariant(
  template: AnimationTemplate,
  theme: AnimationTheme,
  seed: number,
): AnimationVariant {
  if (!Number.isFinite(seed)) throw new Error('Animation seed must be finite.')
  const random = randomFromSeed(seed)
  const between = ([min, max]: readonly [number, number]) => min + random() * (max - min)

  return {
    templateId: template.id,
    themeId: theme.id,
    seed: seed >>> 0,
    durationMs: Math.round(between(template.durationMs) * theme.motion.durationScale),
    amplitude: between(template.amplitude) * theme.motion.amplitudeScale,
    easing: theme.motion.easing[template.category],
    loops: template.loops,
  }
}

export function createMotionVariant(template: AnimationTemplate, seed: number, themeId: AnimationThemeId = 'soft') {
  if (!Number.isFinite(seed)) throw new Error('Animation seed must be finite.')
  const random = randomFromSeed(seed)
  const [min, max] = template.durationMs
  const durationScale = animationThemes[themeId].motion.durationScale
  return {
    templateId: template.id,
    motion: template.motion,
    duration: Math.round(((min + random() * (max - min)) * durationScale) / 100) / 10,
    seed: seed >>> 0,
    themeId,
  }
}
