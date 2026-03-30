import { openDB } from '../db/database'

export const EntryTagRepository = {
  async create(entryTag: { entry_id: string; tag_id: string }): Promise<void> {
    const db = await openDB()
    await db.runAsync(
      `INSERT OR IGNORE INTO entry_tags (entry_id, tag_id) VALUES (?, ?)`,
      entryTag.entry_id,
      entryTag.tag_id,
    )
  },
  async getByTagId(tag_id: string): Promise<{ entry_id: string; tag_id: string }[]> {
    const db = await openDB()
    const rows: any[] = await db.getAllAsync('SELECT * FROM entry_tags WHERE tag_id = ?', tag_id)
    return rows.map(row => ({
      entry_id: row.entry_id,
      tag_id: row.tag_id,
    }))
  },

  async deleteAll(): Promise<void> {
    const db = await openDB()
    await db.runAsync('DELETE FROM entry_tags')
  },
  async getAll(): Promise<{ entry_id: string; tag_id: string }[]> {
    const db = await openDB()
    const rows: any[] = await db.getAllAsync('SELECT * FROM entry_tags')
    return rows.map(row => ({
      entry_id: row.entry_id,
      tag_id: row.tag_id,
    }))
  },
}
