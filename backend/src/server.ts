import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { DatabaseSync } from 'node:sqlite'
import { backendHost, backendPort } from './config.ts'
import { openDatabase } from './database.ts'
import { deleteTemplate, listTemplates, saveTemplate, saveTemplates } from './landscapeTemplateRepository.ts'
import { validateLandscapeTemplate } from '../../src/features/landscape/model/templates.ts'

const maxBodyBytes = 2_000_000
const database = openDatabase()

class HttpError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function send(response: ServerResponse, status: number, value: unknown): void {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  response.end(JSON.stringify(value))
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > maxBodyBytes) throw new HttpError(413, 'Request body exceeds 2 MB.')
    chunks.push(buffer)
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown }
  catch { throw new HttpError(400, 'Request body must be valid JSON.') }
}

function handleRequest(database: DatabaseSync, request: IncomingMessage, response: ServerResponse): void {
  void (async () => {
    const url = new URL(request.url ?? '/', `http://${backendHost}:${backendPort}`)
    if (request.method === 'GET' && url.pathname === '/health') {
      send(response, 200, { status: 'ok', storage: 'sqlite' })
      return
    }
    const collectionPath = '/api/v1/landscape-templates'
    if (url.pathname === collectionPath && request.method === 'GET') {
      send(response, 200, { templates: listTemplates(database) })
      return
    }
    if (url.pathname === collectionPath && request.method === 'PUT') {
      const body = await readJson(request)
      if (!body || typeof body !== 'object' || !('templates' in body) || !Array.isArray(body.templates)) {
        throw new HttpError(400, 'Expected a templates array.')
      }
      let templates
      try { templates = body.templates.map(validateLandscapeTemplate) }
      catch (error) { throw new HttpError(400, error instanceof Error ? error.message : 'Template data is invalid.') }
      if (new Set(templates.map(({ id }) => id)).size !== templates.length) throw new HttpError(400, 'Template IDs must be unique.')
      send(response, 200, { saved: saveTemplates(database, templates) })
      return
    }
    const match = /^\/api\/v1\/landscape-templates\/([A-Za-z0-9_-]{1,80})$/.exec(url.pathname)
    if (match && request.method === 'PUT') {
      const value = await readJson(request)
      if (!value || typeof value !== 'object' || !('id' in value) || value.id !== match[1]) {
        throw new HttpError(400, 'Route and template IDs must match.')
      }
      let template
      try { template = validateLandscapeTemplate(value) }
      catch (error) { throw new HttpError(400, error instanceof Error ? error.message : 'Template data is invalid.') }
      send(response, 200, { template: saveTemplate(database, template) })
      return
    }
    if (match && request.method === 'DELETE') {
      deleteTemplate(database, match[1])
      send(response, 200, { deleted: true })
      return
    }
    send(response, 404, { error: 'Route not found.' })
  })().catch((error: unknown) => {
    const status = error instanceof HttpError ? error.status : 500
    send(response, status, { error: error instanceof Error ? error.message : 'Request failed.' })
  })
}

const server = createServer((request, response) => handleRequest(database, request, response))
server.listen(backendPort, backendHost, () => console.log(`2D Maker local API: http://${backendHost}:${backendPort}`))

function shutdown(): void {
  server.close(() => {
    database.close()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
