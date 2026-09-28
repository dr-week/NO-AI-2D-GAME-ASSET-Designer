import type { MotionPreset } from '../../animation/themeEngine'

export type Motion = MotionPreset
export type Point = { x: number; y: number }
type LayerBase = {
  id: string
  name: string
  motion: Motion
  duration: number
}

export type ImageLayer = LayerBase & {
  kind: 'image'
  points: Point[]
  maskUrl: string
}

export type TextLayer = LayerBase & {
  kind: 'text'
  text: string
  x: number
  y: number
  fontSize: number
  fill: string
}

export type Layer = ImageLayer | TextLayer

export type FeedbackEntry = {
  id: string
  createdAt: string
  rating: 'like' | 'dislike'
  image: string
  backgroundMotion: Motion
  layers: Pick<Layer, 'name' | 'motion' | 'duration'>[]
}
