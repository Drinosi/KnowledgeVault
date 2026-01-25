import 'react-native-get-random-values'

import { useEffect, useState } from 'react'
import { Text, View, FlatList, Button, ImageBackground, Pressable } from 'react-native'
import { Link } from 'expo-router'

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'

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
    <View style={{ flex: 1, height: 'auto', flexGrow: 1 }}>
      {entries.length ? (
        <>
          <FlatList
            style={{ padding: 4 }}
            data={entries}
            keyExtractor={item => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <Link
                style={{
                  flex: 1,
                  margin: 6,
                  maxHeight: 200,
                  overflow: 'hidden',
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
          <Pressable
            onPress={() => setCreateOpen(true)}
            style={({ pressed }) => [
              {
                height: 60,
                width: 60,
                marginBottom: 20,
                borderRadius: 99,
                marginHorizontal: 'auto',
                backgroundColor: 'black',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              style={{
                alignSelf: 'center',
                color: '#FFFFFF',
                fontSize: 30,
                marginBottom: 4,
              }}
            >
              +
            </Text>
          </Pressable>
        </>
      ) : (
        <SafeAreaProvider>
          <SafeAreaView
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              position: 'absolute',
              inset: 0,
            }}
          >
            <ImageBackground
              resizeMethod="resize"
              style={{ flex: 1, position: 'absolute', inset: 0 }}
              source={require('../../assets/images/main_page_background.png')}
            />
            <Pressable
              onPress={() => setCreateOpen(true)}
              style={({ pressed }) => [
                {
                  height: 52,
                  width: 300,
                  marginBottom: 20,
                  borderRadius: 12,
                  backgroundColor: 'indigo',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.85 : 0.8,
                },
              ]}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Add an entry
              </Text>
            </Pressable>
          </SafeAreaView>
        </SafeAreaProvider>
      )}

      {createOpen && (
        <CreateEntryForm visible={createOpen} setVisible={setCreateOpen} onSubmit={handleCreate} />
      )}
    </View>
  )
}
