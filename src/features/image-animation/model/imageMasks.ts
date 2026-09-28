import type { Point } from './types'
import { applyColorMaskPixels, getColorMaskDimensions, mapColorMaskPoint, maxColorTolerance } from './colorMaskPixels'

const maxMaskEdge = 1024

type MaskResponse = { id: number; blob?: Blob; error?: string }
type PendingMask = { resolve: (blob: Blob) => void; reject: (error: Error) => void }

let worker: Worker | undefined
let nextRequestId = 0
const pending = new Map<number, PendingMask>()

export async function createColorMask(source: HTMLImageElement, point: Point, tolerance: number): Promise<string> {
  validateSelection(source, point, tolerance)
  if (typeof Worker === 'undefined' || typeof createImageBitmap !== 'function' || typeof OffscreenCanvas === 'undefined' || typeof OffscreenCanvas.prototype.convertToBlob !== 'function') {
    return createColorMaskOnMainThread(source, point, tolerance)
  }

  const dimensions = getColorMaskDimensions(source.naturalWidth, source.naturalHeight, maxMaskEdge)
  const bitmap = dimensions.width !== source.naturalWidth || dimensions.height !== source.naturalHeight
    ? await createImageBitmap(source, {
      resizeWidth: dimensions.width,
      resizeHeight: dimensions.height,
      resizeQuality: 'high',
    })
    : await createImageBitmap(source)

  try {
    const blob = await processMaskInWorker(bitmap, source.naturalWidth, source.naturalHeight, point, tolerance)
    return await blobToDataUrl(blob)
  } finally {
    bitmap?.close()
  }
}

export function disposeColorMaskWorker() {
  worker?.terminate()
  worker = undefined
  for (const request of pending.values()) request.reject(new Error('Color mask operation was interrupted.'))
  pending.clear()
}

function validateSelection(source: HTMLImageElement, point: Point, tolerance: number) {
  if (!source?.naturalWidth || !source.naturalHeight) throw new Error('Choose a loaded image before selecting a color.')
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || point.x < 0 || point.y < 0 || point.x > source.naturalWidth || point.y > source.naturalHeight) {
    throw new Error('Choose a point inside the image.')
  }
  if (!Number.isFinite(tolerance) || tolerance < 0 || tolerance > maxColorTolerance) {
    throw new Error(`Color tolerance must be between 0 and ${maxColorTolerance}.`)
  }
}

function createColorMaskOnMainThread(source: HTMLImageElement, point: Point, tolerance: number): string {
  const { width, height } = getColorMaskDimensions(source.naturalWidth, source.naturalHeight, maxMaskEdge)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Color selection is unavailable in this browser.')
  context.drawImage(source, 0, 0, width, height)
  const pixels = context.getImageData(0, 0, width, height)
  const { x, y } = mapColorMaskPoint(point, source.naturalWidth, source.naturalHeight, width, height)
  applyColorMaskPixels(pixels.data, width, height, x, y, tolerance)
  context.putImageData(pixels, 0, 0)
  return canvas.toDataURL('image/png')
}

function processMaskInWorker(bitmap: ImageBitmap, sourceWidth: number, sourceHeight: number, point: Point, tolerance: number) {
  const activeWorker = getWorker()
  const id = ++nextRequestId
  return new Promise<Blob>((resolve, reject) => {
    pending.set(id, { resolve, reject })
    try {
      activeWorker.postMessage({ id, bitmap, sourceWidth, sourceHeight, point, tolerance }, [bitmap])
    } catch (cause) {
      pending.delete(id)
      reject(cause instanceof Error ? cause : new Error('Could not start color selection.'))
    }
  })
}

function getWorker(): Worker {
  if (worker) return worker
  const instance = new Worker(new URL('./colorMask.worker.ts', import.meta.url), { type: 'module' })
  instance.onmessage = ({ data }: MessageEvent<MaskResponse>) => {
    const request = pending.get(data.id)
    if (!request) return
    pending.delete(data.id)
    if (data.error) request.reject(new Error(data.error))
    else if (data.blob) request.resolve(data.blob)
    else request.reject(new Error('Color selection returned no mask.'))
  }
  instance.onerror = (event) => {
    event.preventDefault()
    if (worker !== instance) return
    instance.terminate()
    worker = undefined
    for (const request of pending.values()) request.reject(new Error('Color selection worker failed.'))
    pending.clear()
  }
  worker = instance
  return instance
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Could not encode color mask.'))
    reader.onerror = () => reject(reader.error ?? new Error('Could not encode color mask.'))
    reader.readAsDataURL(blob)
  })
}
