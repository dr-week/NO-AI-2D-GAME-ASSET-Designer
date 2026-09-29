export type ArtworkCategoryId = 'forms' | 'products' | 'architecture' | 'nature' | 'abstract'
export type ArtworkPieceId = 'box' | 'sphere' | 'cone' | 'torus' | 'bottle' | 'cup' | 'column' | 'roof' | 'tree' | 'rock' | 'torusKnot' | 'icosahedron'

export const artworkCategories: { id: ArtworkCategoryId; name: string; pieces: { id: ArtworkPieceId; name: string }[] }[] = [
  { id: 'forms', name: 'Forms', pieces: [{ id: 'box', name: 'Cube' }, { id: 'sphere', name: 'Sphere' }, { id: 'cone', name: 'Cone' }, { id: 'torus', name: 'Ring' }] },
  { id: 'products', name: 'Products', pieces: [{ id: 'bottle', name: 'Bottle' }, { id: 'cup', name: 'Cup' }, { id: 'box', name: 'Package' }, { id: 'sphere', name: 'Ball' }] },
  { id: 'architecture', name: 'Architecture', pieces: [{ id: 'box', name: 'Block' }, { id: 'column', name: 'Column' }, { id: 'roof', name: 'Roof' }, { id: 'torus', name: 'Arch' }] },
  { id: 'nature', name: 'Nature', pieces: [{ id: 'tree', name: 'Tree' }, { id: 'rock', name: 'Rock' }, { id: 'sphere', name: 'Orb' }, { id: 'cone', name: 'Mountain' }] },
  { id: 'abstract', name: 'Abstract', pieces: [{ id: 'torusKnot', name: 'Knot' }, { id: 'icosahedron', name: 'Crystal' }, { id: 'torus', name: 'Ring' }, { id: 'box', name: 'Cube' }] },
]
