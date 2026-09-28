import type { MotionPreset } from '../../animation/themeEngine'

export type Motion = MotionPreset
export type Point = { x: number; y: number }
export type Layer = {
  id: string
  name: string
  points: Point[]
  maskUrl: string
  motion: Motion
  duration: number
  kind?: 'image' | 'text'
  text?: string
  x?: number
  y?: number
  fontSize?: number
  fill?: string
}
export type FeedbackEntry = {
  id: string
  createdAt: string
  rating: 'like' | 'dislike'
  image: string
  backgroundMotion: Motion
  layers: Pick<Layer, 'name' | 'motion' | 'duration'>[]
}
