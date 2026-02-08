import { openDB } from '../db/database'
import { Entry } from '../domain/Entry'

type DBEntryRow = {
  id: string
  title: string
  content: string
  type: string
  language: string | null
  source_url: string | null
  created_at: number
  updated_at: number | null
}

export const EntryRepository = {
  async create(entry: Entry): Promise<void> {
    const db = await openDB()

    await db.runAsync(
      `
      INSERT OR REPLACE INTO entries
      (id, title, content, type, language, source_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      entry.id,
      entry.title,
      entry.content,
      entry.type,
      entry.language ?? null,
      entry.sourceUrl ?? null,
      entry.createdAt,
      entry.updatedAt ?? null,
    )
  },

  async getAll(limit: number, offset: number, order: 'ASC' | 'DESC'): Promise<Entry[]> {
    const db = await openDB()

    const rows: DBEntryRow[] = await db.getAllAsync(
      `SELECT 
        id,
        title,
        substr(content, 1, 200) as content,
        type,
        language,
        source_url,
        created_at,
        updated_at
       FROM entries
       ORDER BY COALESCE(updated_at, created_at) ${order}
       LIMIT ? OFFSET ?`,
      [limit, offset],
    )

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      type: row.type as Entry['type'],
      language: row.language,
      sourceUrl: row.source_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  },

  async getById(id: string): Promise<Entry | null> {
    const db = await openDB()

    const row: DBEntryRow | null = await db.getFirstAsync(
      'SELECT * FROM entries WHERE id = ? LIMIT 1',
      id,
    )

    if (!row) return null

    return {
      id: row.id,
      title: row.title,
      content: row.content,
      type: row.type as Entry['type'],
      language: row.language,
      sourceUrl: row.source_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  },

  async delete(id: string): Promise<void> {
    const db = await openDB()
    await db.runAsync('DELETE FROM entries WHERE id = ?', id)
  },

  async deleteAll(): Promise<void> {
    const db = await openDB()
    await db.runAsync('DELETE FROM entries')
  },

  async update(id: string, changes: Partial<Entry>): Promise<void> {
    const db = await openDB()

    const columnMap: Record<string, string> = {
      title: 'title',
      content: 'content',
      type: 'type',
      language: 'language',
      sourceUrl: 'source_url',
    }

    const fields: string[] = []
    const values: any[] = []

    for (const key of Object.keys(changes) as (keyof Entry)[]) {
      if (key === 'id' || key === 'createdAt' || key === 'updatedAt') {
        continue
      }

      const column = columnMap[key]
      if (!column) continue

      fields.push(`${column} = ?`)
      values.push(changes[key])
    }

    fields.push('updated_at = ?')
    values.push(Date.now())

    values.push(id)

    const query = `UPDATE entries SET ${fields.join(', ')} WHERE id = ?`

    await db.runAsync(query, ...values)
  },
}
