import assert from 'node:assert/strict'
import test from 'node:test'
import { createFeedbackEntry } from '../src/features/image-animation/model/feedback.ts'

test('rating captures the generated scene and keeps compact layer settings', () => {
  const entry = createFeedbackEntry({
    id: 'trial-1', createdAt: '2026-09-28T10:00:00.000Z', rating: 'like', image: 'scene.png', backgroundMotion: 'float',
    layers: [
      { id: 'text-1', kind: 'text', name: 'Title', motion: 'sharedAxisX', duration: 0.3, text: 'Hello', x: 10, y: 20, fontSize: 24, fill: '#112233' },
    ],
  })
  assert.deepEqual(entry, {
    id: 'trial-1', createdAt: '2026-09-28T10:00:00.000Z', rating: 'like', image: 'scene.png', backgroundMotion: 'float',
    layers: [{ name: 'Title', motion: 'sharedAxisX', duration: 0.3 }],
  })
})

test('rating preserves dislike decisions', () => {
  const entry = createFeedbackEntry({
    id: 'trial-2', createdAt: '2026-09-28T10:00:00.000Z', rating: 'dislike', image: 'scene.png', backgroundMotion: 'still', layers: [],
  })
  assert.equal(entry.rating, 'dislike')
})
