import { loadArtworkFeedbackEntries } from './feedbackStore'
import { loadFeedbackEntries as loadAnimationFeedback } from '../../image-animation/io/feedbackStore'

export const artworkFeedbackFileName = '2dmaker-artwork-feedback.jsonl'

type Rating = 'like' | 'dislike'
type UnifiedEntry = {
  category: 'character' | 'landscape' | 'animation'
  createdAt: string
  rating: Rating
  snapshot: unknown
}

export function serializeUnifiedFeedbackLog(): string {
  const entries: UnifiedEntry[] = [
    ...loadArtworkFeedbackEntries().map(({ kind, createdAt, rating, snapshot }) => {
      let settings: unknown = snapshot
      try { settings = JSON.parse(snapshot) } catch { /* retain legacy snapshot text */ }
      return { category: kind, createdAt, rating, snapshot: settings }
    }),
    ...loadAnimationFeedback().map(({ createdAt, rating, image, backgroundMotion, layers }) => ({
      category: 'animation' as const,
      createdAt,
      rating,
      snapshot: { image, backgroundMotion, layers },
    })),
  ].sort((left, right) => left.createdAt.localeCompare(right.createdAt))
  return entries.map((entry) => JSON.stringify({ version: 1, ...entry })).join('\n') + (entries.length ? '\n' : '')
}
