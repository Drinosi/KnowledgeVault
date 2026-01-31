export type EntryType = 'snippet' | 'concept' | 'link'

export interface Entry {
  id: string
  title: string
  content: string
  type: EntryType
  language?: string | null
  sourceUrl?: string | null
  createdAt: number
  updatedAt?: number | null
}
