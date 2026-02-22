export type Entry = {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt?: number | null
  locked: 1 | null
}
