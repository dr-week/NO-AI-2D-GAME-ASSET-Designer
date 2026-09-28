import { validateImageProject, type ImageProject } from './projectFile'

const storageKey = '2dmaker-image-project-v1'
const maxStoredBytes = 1_500_000

export function saveProjectLocally(project: ImageProject): void {
  const serialized = JSON.stringify(project)
  if (new Blob([serialized]).size > maxStoredBytes) throw new Error('Project is too large for browser storage. Download the project JSON instead.')
  try { localStorage.setItem(storageKey, serialized) }
  catch { throw new Error('Browser storage is full or unavailable. Download the project JSON instead.') }
}

export function readProjectLocally(): ImageProject | null {
  try {
    const serialized = localStorage.getItem(storageKey)
    return serialized ? validateImageProject(JSON.parse(serialized) as unknown) : null
  } catch {
    return null
  }
}
