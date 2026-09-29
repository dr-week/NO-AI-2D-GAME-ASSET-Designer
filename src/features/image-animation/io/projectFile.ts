import { motionDefinitions } from '../../animation/themeEngine.ts'
import type { Layer, Motion } from '../model/types'

const projectVersion = 2
const maxProjectBytes = 30 * 1024 * 1024
type JsonObject = Record<string, unknown>

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isMotion(value: unknown): value is Motion {
  return typeof value === 'string' && Object.hasOwn(motionDefinitions, value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export type ImageProject = {
  version: 2
  kind: '2dmaker-image-animation'
  width: number
  height: number
  imageDataUrl: string
  fileName: string
  backgroundMotion: Motion
  layers: Layer[]
}

export function createImageProject(width: number, height: number, imageDataUrl: string, fileName: string, backgroundMotion: Motion, layers: Layer[]): ImageProject {
  return { version: projectVersion, kind: '2dmaker-image-animation', width, height, imageDataUrl, fileName, backgroundMotion, layers }
}

export async function readImageProject(file: File): Promise<ImageProject> {
  if (file.size > maxProjectBytes) throw new Error('Project file must be 30 MB or smaller.')
  let value: unknown
  try { value = JSON.parse(await file.text()) }
  catch { throw new Error('Project file is not valid JSON.') }
  return validateImageProject(value)
}

export function validateImageProject(value: unknown): ImageProject {
  if (!isObject(value)) throw new Error('Project data must be an object.')
  const version = value.version
  if (value.kind !== '2dmaker-image-animation' || (version !== 1 && version !== projectVersion)) throw new Error('Unsupported project format or version.')

  const { width, height, imageDataUrl, fileName } = value
  if (!isFiniteNumber(width) || !isFiniteNumber(height) || !Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0 || width > 6000 || height > 6000 || width * height > 16_000_000) {
    throw new Error('Project canvas dimensions are invalid or exceed 16 MP.')
  }
  if (typeof imageDataUrl !== 'string' || imageDataUrl.length > 36 * 1024 * 1024 || !/^data:image\/(png|jpeg|webp);base64,/.test(imageDataUrl)) throw new Error('Project artwork is missing or uses an unsupported format.')
  if (typeof fileName !== 'string' || fileName.length > 255) throw new Error('Project image name is invalid.')
  if (!isMotion(value.backgroundMotion) || !Array.isArray(value.layers) || value.layers.length > 32) throw new Error('Project motion or layer list is invalid.')

  const ids = new Set<string>()
  const layers = value.layers.map((entry, index): Layer => {
    if (!isObject(entry)) throw new Error(`Layer ${index + 1} must be an object.`)
    const { id: layerId, name, motion, duration } = entry
    const label = typeof layerId === 'string' ? `Layer ${layerId}` : `Layer ${index + 1}`
    if (typeof layerId !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(layerId) || ids.has(layerId)) throw new Error('Project layer IDs must be unique safe strings.')
    ids.add(layerId)
    if (typeof name !== 'string' || name.length > 60 || !isMotion(motion) || !isFiniteNumber(duration) || duration < 0.2 || duration > 10) throw new Error(`${label} has invalid settings.`)

    if (entry.kind === 'text') {
      const { text, x, y, fontSize, fill } = entry
      if (typeof text !== 'string' || !text.length || text.length > 500 || !isFiniteNumber(x) || !isFiniteNumber(y) || x < 0 || x > width || y < 0 || y > height || !isFiniteNumber(fontSize) || fontSize < 8 || fontSize > 400 || typeof fill !== 'string' || !/^#[\da-fA-F]{6}$/.test(fill)) throw new Error(`${label} has invalid text or style.`)
      return { id: layerId, name, motion, duration, kind: 'text', text, x, y, fontSize, fill }
    }

    if (entry.kind !== undefined && entry.kind !== 'image') throw new Error(`${label} has an unknown kind.`)
    if (typeof entry.maskUrl !== 'string' || (entry.maskUrl && (!entry.maskUrl.startsWith('data:image/png;base64,') || entry.maskUrl.length > maxProjectBytes)) || !Array.isArray(entry.points) || entry.points.length > 200) throw new Error(`${label} has invalid mask data.`)
    const points = entry.points.map((point): { x: number; y: number } => {
      if (!isObject(point) || !isFiniteNumber(point.x) || !isFiniteNumber(point.y) || point.x < 0 || point.y < 0 || point.x > width || point.y > height) throw new Error(`${label} has an invalid point.`)
      return { x: point.x, y: point.y }
    })
    if (!entry.maskUrl && points.length < 3) throw new Error(`${label} needs a polygon or color mask.`)
    return { id: layerId, name, motion, duration, kind: 'image', maskUrl: entry.maskUrl, points }
  })
  return { version: projectVersion, kind: '2dmaker-image-animation', width, height, imageDataUrl, fileName, backgroundMotion: value.backgroundMotion, layers }
}

export async function loadProjectImage(imageDataUrl: string, width: number, height: number): Promise<string> {
  const image = new Image()
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('Project artwork could not be opened.'))
    image.src = imageDataUrl
  })
  if (image.naturalWidth !== width || image.naturalHeight !== height) throw new Error('Project artwork dimensions do not match the project data.')
  return image.src
}
