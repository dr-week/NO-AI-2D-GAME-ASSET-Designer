import type { FeedbackEntry, Layer } from './types'

type FeedbackSnapshot = Omit<FeedbackEntry, 'layers'> & { layers: Layer[] }

export function createFeedbackEntry(snapshot: FeedbackSnapshot): FeedbackEntry {
  const { id, createdAt, rating, image, backgroundMotion, layers } = snapshot
  return {
    id,
    createdAt,
    rating,
    image,
    backgroundMotion,
    layers: layers.map(({ name, motion, duration }) => ({ name, motion, duration })),
  }
}
