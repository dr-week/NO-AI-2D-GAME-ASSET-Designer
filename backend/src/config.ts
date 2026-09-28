import { homedir } from 'node:os'
import { join } from 'node:path'

export const backendHost = '127.0.0.1'
export const backendPort = Number(process.env.TWO_D_MAKER_PORT ?? 4174)

if (!Number.isInteger(backendPort) || backendPort < 1 || backendPort > 65_535) {
  throw new Error('TWO_D_MAKER_PORT must be a valid TCP port.')
}

export function databasePath(): string {
  const override = process.env.TWO_D_MAKER_DATA_DIR
  if (override) return join(override, '2dmaker.sqlite')
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    return join(process.env.LOCALAPPDATA, '2DMaker', '2dmaker.sqlite')
  }
  if (process.platform === 'darwin') return join(homedir(), 'Library', 'Application Support', '2DMaker', '2dmaker.sqlite')
  return join(process.env.XDG_DATA_HOME ?? join(homedir(), '.local', 'share'), '2dmaker', '2dmaker.sqlite')
}
