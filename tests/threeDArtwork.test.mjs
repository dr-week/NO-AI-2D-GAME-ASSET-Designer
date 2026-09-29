import assert from 'node:assert/strict'
import test from 'node:test'
import { artworkCategories } from '../src/features/three-d/model/artworkCatalog.ts'
import { createArtworkPiece } from '../src/features/three-d/model/objectFactory.ts'

test('artwork catalog exposes distinct non-empty categories', () => {
  assert.deepEqual(artworkCategories.map(({ id }) => id), ['forms', 'products', 'architecture', 'nature', 'abstract'])
  for (const category of artworkCategories) assert.ok(category.pieces.length > 0)
})

test('every catalog piece builds finite 3D geometry', () => {
  const pieceIds = new Set(artworkCategories.flatMap(({ pieces }) => pieces.map(({ id }) => id)))
  for (const id of pieceIds) {
    const piece = createArtworkPiece(id, '#287c79')
    assert.ok(piece.children.length > 0, `${id} has renderable parts`)
    piece.traverse((object) => {
      if (!object.isMesh) return
      const positions = object.geometry.getAttribute('position')
      assert.ok(positions.count > 0, `${id} has vertices`)
      for (const value of positions.array) assert.ok(Number.isFinite(value), `${id} has finite coordinates`)
    })
  }
})
