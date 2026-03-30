import { openDB } from '../db/database'
import { Tag } from '../domain/Tag'

export const TagRepository = {
  async create(tag: Tag): Promise<void> {
    const db = await openDB()
    await db.runAsync(`INSERT OR IGNORE INTO tags (id, name) VALUES (?, ?)`, tag.id, tag.name)
  },

  async getAll(): Promise<Tag[]> {
    const db = await openDB()
    const rows: any[] = await db.getAllAsync('SELECT * FROM tags ORDER BY name ASC')
    return rows.map(row => ({
      id: row.id,
      name: row.name,
    }))
  },

  async findByName(name: string): Promise<Tag | null> {
    const db = await openDB()
    const rows: any[] = await db.getAllAsync('SELECT * FROM tags WHERE name = ?', name)

    if (!rows || rows.length === 0) return null

    const row = rows[0]
    return { id: row.id, name: row.name }
  },

  async deleteAll(): Promise<void> {
    const db = await openDB()
    await db.runAsync('DELETE FROM tags')
  },
}
