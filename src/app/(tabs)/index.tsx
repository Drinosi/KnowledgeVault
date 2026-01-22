import 'react-native-get-random-values'

import { useEffect, useState } from 'react'
import { Text, View, FlatList, Button } from 'react-native'
import { Link } from 'expo-router'

import { v4 as uuidv4 } from 'uuid'

import CreateEntryForm from '../../components/CreateEntry'
import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'
import { runMigrations } from '../../db/migrations'

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [createOpen, setCreateOpen] = useState(false)

  const handleCreate = async (entryData: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now()
    const newEntry: Entry = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      ...entryData,
    }
    await EntryRepository.create(newEntry)
    const allEntries = await EntryRepository.getAll()
    setEntries(allEntries)
    setCreateOpen(false)
  }

  useEffect(() => {
    ;(async () => {
      await runMigrations()
      const allEntries = await EntryRepository.getAll()
      setEntries(allEntries)
    })()
  }, [entries.length])

  return (
    <View style={{ flex: 1, padding: 4 }}>
      {entries.length ? (
        <>
          <FlatList
            data={entries}
            keyExtractor={item => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <Link
                style={{
                  flex: 1,
                  margin: 6,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3.84,
                  backgroundColor: 'white',
                  elevation: 5,
                  borderRadius: 12,
                }}
                href={{
                  pathname: '[entry]/EntryDetails',
                  params: { entry: item.id },
                }}
              >
                <View
                  style={{
                    padding: 10,
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <Text
                    style={{ color: 'black', fontSize: 18, fontWeight: '700', marginBottom: 12 }}
                  >
                    {item.title}
                  </Text>
                  <Text style={{ color: 'black', fontSize: 14, marginBottom: 8 }}>
                    {item.content}
                  </Text>
                  <Text style={{ color: 'black', fontSize: 14, marginBottom: 4 }}>
                    Created on {new Date(Number(item.createdAt)).toDateString()}
                  </Text>
                  <Text style={{ color: 'black', fontSize: 14 }}>
                    Last updated on {new Date(Number(item.updatedAt)).toDateString()}
                  </Text>
                </View>
              </Link>
            )}
          />
          <View>
            <Button title="Add entry" onPress={() => setCreateOpen(true)} />
          </View>
        </>
      ) : (
        <View>
          <Button title="No entries yet. Create one?" onPress={() => setCreateOpen(true)} />
        </View>
      )}

      {createOpen && (
        <CreateEntryForm visible={createOpen} setVisible={setCreateOpen} onSubmit={handleCreate} />
      )}
    </View>
  )
}
