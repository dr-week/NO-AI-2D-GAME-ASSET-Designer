import { applyColorMaskPixels, mapColorMaskPoint } from './colorMaskPixels'

type ColorMaskRequest = {
  id: number
  bitmap: ImageBitmap
  sourceWidth: number
  sourceHeight: number
  point: { x: number; y: number }
  tolerance: number
}

self.onmessage = async ({ data }: MessageEvent<ColorMaskRequest>) => {
  const { id, bitmap, sourceWidth, sourceHeight, point, tolerance } = data
  let canvas: OffscreenCanvas | undefined
  try {
    const width = bitmap.width
    const height = bitmap.height
    const { x, y } = mapColorMaskPoint(point, sourceWidth, sourceHeight, width, height)
    canvas = new OffscreenCanvas(width, height)
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('Color selection is unavailable in this browser.')
    context.drawImage(bitmap, 0, 0, width, height)

    const pixels = context.getImageData(0, 0, width, height)
    applyColorMaskPixels(pixels.data, width, height, x, y, tolerance)
    context.putImageData(pixels, 0, 0)
    const blob = await canvas.convertToBlob({ type: 'image/png' })
    self.postMessage({ id, blob })
  } catch (cause) {
    self.postMessage({ id, error: cause instanceof Error ? cause.message : 'Could not create color mask.' })
  } finally {
    bitmap.close()
    if (canvas) canvas.width = canvas.height = 0
  }
}
