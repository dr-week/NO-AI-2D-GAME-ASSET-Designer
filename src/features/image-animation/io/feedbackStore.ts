import { motionDefinitions } from '../../animation/themeEngine'
import type { FeedbackEntry, Motion } from '../model/types'

const storageKey = '2dmaker-animation-feedback-v1'
export const feedbackFileName = '2dmaker-animation-feedback.jsonl'
const maxEntries = 5000

export type FeedbackDirectory = {
  getFileHandle(name: string, options: { create: boolean }): Promise<{
    getFile(): Promise<{ text(): Promise<string> }>
    createWritable(): Promise<{ write(data: string): Promise<void>; close(): Promise<void> }>
  }>
}

type DirectoryPickerWindow = Window & { showDirectoryPicker?: () => Promise<FeedbackDirectory> }

function isMotion(value: unknown): value is Motion {
  return typeof value === 'string' && Object.hasOwn(motionDefinitions, value)
}

function isFeedbackEntry(value: unknown): value is FeedbackEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Record<string, unknown>
  return typeof entry.id === 'string'
    && typeof entry.createdAt === 'string'
    && Number.isFinite(Date.parse(entry.createdAt))
    && (entry.rating === 'like' || entry.rating === 'dislike')
    && typeof entry.image === 'string'
    && isMotion(entry.backgroundMotion)
    && Array.isArray(entry.layers)
    && entry.layers.every((layer: unknown) => !!layer && typeof layer === 'object'
      && typeof (layer as Record<string, unknown>).name === 'string'
      && isMotion((layer as Record<string, unknown>).motion)
      && typeof (layer as Record<string, unknown>).duration === 'number'
      && Number.isFinite((layer as Record<string, unknown>).duration))
}

export function loadFeedbackEntries(): FeedbackEntry[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    return Array.isArray(value) ? value.filter(isFeedbackEntry).slice(-maxEntries) : []
  } catch {
    return []
  }
}

export function saveFeedbackEntries(entries: FeedbackEntry[]): boolean {
  try {
    localStorage.setItem(storageKey, JSON.stringify(entries.slice(-maxEntries)))
    return true
  } catch {
    return false
  }
}

export function serializeFeedbackLog(entries: FeedbackEntry[]): string {
  const text = entries.map((entry) => JSON.stringify(entry)).join('\n')
  return text ? `${text}\n` : ''
}

export async function chooseFeedbackDirectory(): Promise<FeedbackDirectory | null> {
  const picker = (window as DirectoryPickerWindow).showDirectoryPicker
  return picker ? picker.call(window) : null
}

export async function appendFeedbackEntry(directory: FeedbackDirectory, entry: FeedbackEntry): Promise<void> {
  const file = await directory.getFileHandle(feedbackFileName, { create: true })
  const previous = await (await file.getFile()).text()
  const writer = await file.createWritable()
  await writer.write(`${previous}${previous && !previous.endsWith('\n') ? '\n' : ''}${JSON.stringify(entry)}\n`)
  await writer.close()
}
