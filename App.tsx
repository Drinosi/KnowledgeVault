import { useEffect, useState } from 'react'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { runMigrations } from './src/db/migrations'
import { EntryRepository } from './src/repositories/EntryRespository'
import { ScrollView, Text, View } from 'react-native'
import { Entry } from './src/domain/Entry'
export default function App() {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    ;(async () => {
      await runMigrations()

      const testId = uuidv4()
      await EntryRepository.create({
        id: testId,
        title: 'Test Entry',
        content: 'This is a test snippet',
        type: 'snippet',
        language: 'ts',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      const allEntries = await EntryRepository.getAll()
      setEntries(allEntries)

      const fetched = await EntryRepository.getById(testId)
      console.log('Fetched by ID:', fetched)
    })()
  }, [])

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#000' }}>
      {entries.map(entry => (
        <View key={entry.id} style={{ marginBottom: 12 }}>
          <Text style={{ color: 'white', fontSize: 16 }}>{entry.content}</Text>
        </View>
      ))}
    </ScrollView>
  )
}
