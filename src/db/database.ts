import * as SQLite from 'expo-sqlite'

export async function openDB() {
  const db = await SQLite.openDatabaseAsync('knowledge_vault.db')
  return db
}
