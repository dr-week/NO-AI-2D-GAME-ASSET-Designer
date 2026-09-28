const storageKey = '2dmaker-artwork-feedback-v1'
const maxEntries = 5000

export type ArtworkFeedbackEntry = {
  kind: 'character' | 'landscape'
  snapshot: string
  rating: 'like' | 'dislike'
  createdAt: string
}

function isArtworkFeedbackEntry(value: unknown): value is ArtworkFeedbackEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Record<string, unknown>
  return (entry.kind === 'character' || entry.kind === 'landscape')
    && typeof entry.snapshot === 'string'
    && (entry.rating === 'like' || entry.rating === 'dislike')
    && typeof entry.createdAt === 'string'
    && Number.isFinite(Date.parse(entry.createdAt))
}

export function loadArtworkFeedbackEntries(): ArtworkFeedbackEntry[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    return Array.isArray(value) ? value.slice(-maxEntries).filter(isArtworkFeedbackEntry) : []
  } catch {
    return []
  }
}

export function saveArtworkFeedbackEntries(entries: ArtworkFeedbackEntry[]): boolean {
  try {
    localStorage.setItem(storageKey, JSON.stringify(entries.slice(-maxEntries)))
    return true
  } catch {
    return false
  }
}
