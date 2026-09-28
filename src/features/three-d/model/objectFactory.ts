import * as THREE from 'three'
import type { ArtworkPieceId } from './artworkCatalog'

export function createArtworkPiece(id: ArtworkPieceId, color: string): THREE.Group {
  const group = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.68, metalness: 0.04 })
  const add = (geometry: THREE.BufferGeometry, y = 0) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = y
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)
  }

  switch (id) {
    case 'box': add(new THREE.BoxGeometry(1.15, 1.15, 1.15), 0.58); break
    case 'sphere': add(new THREE.SphereGeometry(0.68, 24, 16), 0.68); break
    case 'cone': add(new THREE.ConeGeometry(0.68, 1.35, 5), 0.68); break
    case 'torus': add(new THREE.TorusGeometry(0.55, 0.18, 10, 28), 0.72); break
    case 'bottle':
      add(new THREE.CylinderGeometry(0.32, 0.42, 1, 20), 0.5)
      add(new THREE.CylinderGeometry(0.19, 0.19, 0.34, 16), 1.17)
      add(new THREE.CylinderGeometry(0.23, 0.23, 0.16, 16), 1.42)
      break
    case 'cup': add(new THREE.CylinderGeometry(0.48, 0.34, 1.1, 24, 1, true), 0.58); break
    case 'column': add(new THREE.CylinderGeometry(0.43, 0.43, 1.65, 16), 0.83); break
    case 'roof': add(new THREE.ConeGeometry(0.82, 1.35, 4), 0.68); break
    case 'tree':
      add(new THREE.CylinderGeometry(0.12, 0.17, 0.72, 8), 0.36)
      add(new THREE.ConeGeometry(0.62, 1.25, 8), 1.18)
      break
    case 'rock': add(new THREE.DodecahedronGeometry(0.68, 0), 0.58); break
    case 'torusKnot': add(new THREE.TorusKnotGeometry(0.48, 0.17, 64, 8), 0.8); break
    case 'icosahedron': add(new THREE.IcosahedronGeometry(0.72, 0), 0.72); break
  }
  return group
}
