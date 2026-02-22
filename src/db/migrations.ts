import { openDB } from './database'
import { createTables, createMetaTable } from './schema'

const CURRENT_SCHEMA_VERSION = 1

type MetaRow = {
  value: string
}

export async function runMigrations() {
  const db = await openDB()

  await db.execAsync(createMetaTable)

  const result = (await db.getAllAsync(
    "SELECT value FROM meta WHERE key = 'schema_version'",
  )) as MetaRow[]
  const currentVersion = result.length ? Number(result[0].value) : 0

  if (currentVersion >= CURRENT_SCHEMA_VERSION) {
    return
  }

  await db.execAsync(createTables)

  await db.runAsync("INSERT OR REPLACE INTO meta (key, value) VALUES ('schema_version', ?)", [
    CURRENT_SCHEMA_VERSION.toString(),
  ])
}
