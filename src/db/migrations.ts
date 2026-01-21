import { openDB } from './database'
import { createTables } from './schema'

export async function runMigrations() {
  const db = await openDB()
  await db.execAsync(createTables)
}
