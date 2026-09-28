import assert from 'node:assert/strict'
import test from 'node:test'
import { validateImageProject } from '../src/features/image-animation/io/projectFile.ts'

const imageLayer = {
  id: 'background', name: 'Background', kind: 'image', motion: 'still', duration: 3,
  maskUrl: '', points: [{ x: 0, y: 0 }, { x: 80, y: 0 }, { x: 40, y: 60 }],
}

function project(layers = [imageLayer], overrides = {}) {
  return {
    version: 2, kind: '2dmaker-image-animation', width: 100, height: 100,
    imageDataUrl: 'data:image/png;base64,AA==', fileName: 'scene.png',
    backgroundMotion: 'still', layers, ...overrides,
  }
}

test('accepts image and text layers and preserves text fields', () => {
  const text = { id: 'caption', name: 'Caption', kind: 'text', motion: 'rise', duration: 0.35, text: 'Hello', x: 50, y: 50, fontSize: 24, fill: '#112233' }
  const result = validateImageProject(project([imageLayer, text]))
  assert.equal(result.layers[1].kind, 'text')
  assert.equal(result.layers[1].text, 'Hello')
  assert.equal(result.layers[1].fill, '#112233')
})

test('project JSON preserves applied motion and duration for restore', () => {
  const text = { id: 'caption', name: 'Caption', kind: 'text', motion: 'sharedAxisX', duration: 0.3, text: 'Hello', x: 50, y: 50, fontSize: 24, fill: '#112233' }
  const result = validateImageProject(JSON.parse(JSON.stringify(project([text]))))
  assert.equal(result.layers[0].motion, 'sharedAxisX')
  assert.equal(result.layers[0].duration, 0.3)
})

test('normalizes valid legacy image layers to the image kind', () => {
  const { kind, ...legacyLayer } = imageLayer
  const result = validateImageProject(project([legacyLayer], { version: 1 }))
  assert.equal(result.layers[0].kind, 'image')
})

test('rejects duplicate layer IDs', () => {
  assert.throws(() => validateImageProject(project([imageLayer, { ...imageLayer }])), /unique safe strings/)
})

test('rejects invalid text style and out-of-canvas positions', () => {
  const text = { id: 'caption', name: 'Caption', kind: 'text', motion: 'rise', duration: 0.35, text: 'Hello', x: 101, y: 50, fontSize: 24, fill: '#112233' }
  assert.throws(() => validateImageProject(project([text])), /invalid text or style/)
})

test('rejects oversized canvases and unsupported motion values', () => {
  assert.throws(() => validateImageProject(project([], { width: 6001 })), /dimensions are invalid/)
  assert.throws(() => validateImageProject(project([ { ...imageLayer, motion: 'unknown' } ])), /invalid settings/)
})
