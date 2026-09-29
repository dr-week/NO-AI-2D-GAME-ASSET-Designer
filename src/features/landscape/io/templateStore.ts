import {
  parseLandscapeTemplateBackup,
  serializeLandscapeTemplateBackup,
  validateLandscapeTemplateId,
  validateLandscapeTemplate,
  type LandscapeTemplate,
} from '../model/templates'

const databaseName = '2dmaker-landscape'
const databaseVersion = 1
const storeName = 'templates'

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('IndexedDB is unavailable in this browser.'))
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) request.result.createObjectStore(storeName, { keyPath: 'id' })
    }
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close()
      resolve(request.result)
    }
    request.onerror = () => reject(new Error('Could not open the local template database.'))
    request.onblocked = () => reject(new Error('Close other 2D Maker tabs to update the local template database.'))
  })
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('Local template database request failed.'))
  })
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onabort = () => reject(new Error('Local template database transaction was aborted.'))
    transaction.onerror = () => reject(new Error('Local template database transaction failed.'))
  })
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore, done: Promise<void>) => Promise<T>): Promise<T> {
  const database = await openDatabase()
  try {
    const transaction = database.transaction(storeName, mode)
    return await run(transaction.objectStore(storeName), transactionDone(transaction))
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') throw new Error('Browser storage is full. Export a template backup and remove unused templates.')
    throw error
  } finally {
    database.close()
  }
}

export function listLandscapeTemplates(): Promise<LandscapeTemplate[]> {
  return withStore('readonly', async (store, done) => {
    const values = await requestResult<unknown[]>(store.getAll())
    await done
    return values.map(validateLandscapeTemplate).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  })
}

export function getLandscapeTemplate(id: string): Promise<LandscapeTemplate | null> {
  validateLandscapeTemplateId(id)
  return withStore('readonly', async (store, done) => {
    const value = await requestResult<unknown>(store.get(id))
    await done
    return value === undefined ? null : validateLandscapeTemplate(value)
  })
}

export function saveLandscapeTemplate(template: LandscapeTemplate): Promise<void> {
  const valid = validateLandscapeTemplate(template)
  return withStore('readwrite', async (store, done) => {
    store.put(valid)
    await done
  })
}

export function deleteLandscapeTemplate(id: string): Promise<void> {
  validateLandscapeTemplateId(id)
  return withStore('readwrite', async (store, done) => {
    store.delete(id)
    await done
  })
}

export async function exportLandscapeTemplates(): Promise<string> {
  return serializeLandscapeTemplateBackup(await listLandscapeTemplates())
}

export async function importLandscapeTemplates(serialized: string): Promise<number> {
  const backup = parseLandscapeTemplateBackup(serialized)
  await withStore('readwrite', async (store, done) => {
    for (const template of backup.templates) store.put(template)
    await done
  })
  return backup.templates.length
}
