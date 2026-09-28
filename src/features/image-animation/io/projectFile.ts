import { motionDefinitions } from '../../animation/themeEngine'
import type { Layer, Motion } from '../model/types'

const projectVersion = 2
const maxProjectBytes = 30 * 1024 * 1024
const allowedMotions = new Set<Motion>(Object.keys(motionDefinitions) as Motion[])

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
  if (!value || typeof value !== 'object') throw new Error('Project data must be an object.')
  const project = value as Partial<ImageProject>
  if (project.kind !== '2dmaker-image-animation' || (project.version !== 1 && project.version !== projectVersion)) throw new Error('Unsupported project format or version.')
  if (!Number.isInteger(project.width) || !Number.isInteger(project.height) || project.width! <= 0 || project.height! <= 0 || project.width! > 6000 || project.height! > 6000 || project.width! * project.height! > 16_000_000) {
    throw new Error('Project canvas dimensions are invalid or exceed 16 MP.')
  }
  if (typeof project.imageDataUrl !== 'string' || project.imageDataUrl.length > 36 * 1024 * 1024 || !/^data:image\/(png|jpeg|webp);base64,/.test(project.imageDataUrl)) throw new Error('Project artwork is missing or uses an unsupported format.')
  if (typeof project.fileName !== 'string' || project.fileName.length > 255) throw new Error('Project image name is invalid.')
  if (!allowedMotions.has(project.backgroundMotion as Motion) || !Array.isArray(project.layers) || project.layers.length > 32) throw new Error('Project motion or layer list is invalid.')
  const ids = new Set<string>()
  const layers = project.layers.map((entry): Layer => {
    if (!entry || typeof entry !== 'object') throw new Error('Project contains an invalid layer.')
    const layer = entry as Layer
    if (typeof layer.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(layer.id) || ids.has(layer.id)) throw new Error('Project layer IDs must be unique safe strings.')
    ids.add(layer.id)
    if (typeof layer.name !== 'string' || layer.name.length > 60 || !allowedMotions.has(layer.motion) || !Number.isFinite(layer.duration) || layer.duration < 0.2 || layer.duration > 10) throw new Error(`Layer ${layer.id} has invalid settings.`)
    if (layer.kind === 'text') {
      if (typeof layer.text !== 'string' || !layer.text.length || layer.text.length > 500 || !Number.isFinite(layer.x) || !Number.isFinite(layer.y) || layer.x! < 0 || layer.x! > project.width! || layer.y! < 0 || layer.y! > project.height! || !Number.isFinite(layer.fontSize) || layer.fontSize! < 8 || layer.fontSize! > 400 || typeof layer.fill !== 'string' || !/^#[\da-fA-F]{6}$/.test(layer.fill)) throw new Error(`Text layer ${layer.id} has invalid content or style.`)
    } else if (layer.kind !== undefined && layer.kind !== 'image') throw new Error(`Layer ${layer.id} has an unknown kind.`)
    if (typeof layer.maskUrl !== 'string' || (layer.maskUrl && (!layer.maskUrl.startsWith('data:image/png;base64,') || layer.maskUrl.length > maxProjectBytes)) || !Array.isArray(layer.points) || layer.points.length > 200) throw new Error(`Layer ${layer.id} has invalid mask data.`)
    for (const point of layer.points) {
      if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || point.x < 0 || point.y < 0 || point.x > project.width! || point.y > project.height!) throw new Error(`Layer ${layer.id} has an invalid point.`)
    }
    return { ...layer, kind: layer.kind ?? 'image' }
  })
  return { version: projectVersion, kind: '2dmaker-image-animation', width: project.width!, height: project.height!, imageDataUrl: project.imageDataUrl, fileName: project.fileName, backgroundMotion: project.backgroundMotion as Motion, layers }
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
