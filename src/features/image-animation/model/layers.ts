import type { ImageLayer, Layer, TextLayer } from './types'

export const maxImageLayers = 32

export function createImageLayer(id: string, name: string, points: ImageLayer['points'], maskUrl: string): ImageLayer {
  return { id, name: name.trim() || 'Untitled layer', kind: 'image', motion: 'still', duration: 3, points, maskUrl }
}

export function createTextLayer(
  id: string,
  text: string,
  fill: string,
  fontSize: number,
  width: number,
  height: number,
): TextLayer | null {
  const cleanText = text.trim()
  if (!cleanText || text.length > 500 || !/^#[\da-fA-F]{6}$/.test(fill)
    || !Number.isFinite(fontSize) || fontSize < 8 || fontSize > 400) return null

  return {
    id,
    name: cleanText.slice(0, 40),
    kind: 'text',
    motion: 'rise',
    duration: 0.35,
    text: cleanText,
    x: width / 2,
    y: height / 2,
    fontSize,
    fill,
  }
}

export function canAddLayer(layers: Layer[]): boolean {
  return layers.length < maxImageLayers
}
