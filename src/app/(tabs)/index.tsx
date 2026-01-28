import 'react-native-get-random-values'

import { useEffect, useState } from 'react'
import { Text, View, FlatList, Image, Pressable, Dimensions } from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { v4 as uuidv4 } from 'uuid'

import CreateEntryForm from '../../components/CreateEntry'
import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'
import { runMigrations } from '../../db/migrations'

import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { addEntry, setEntries } from '../../store/slices/entriesSlice'

const { width } = Dimensions.get('window')

export default function App() {
  const dispatch: AppDispatch = useDispatch()
  const entries = useSelector((state: RootState) => state.entries.entries)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      await runMigrations()
      const allEntries = await EntryRepository.getAll()
      dispatch(setEntries(allEntries))
    })()
  }, [])

  const handleCreate = async (entryData: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now()
    const newEntry: Entry = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      ...entryData,
    }

    await EntryRepository.create(newEntry)

    dispatch(addEntry(newEntry))

    setCreateOpen(false)
  }

  return (
    <View style={{ flex: 1 }}>
      {entries.length ? (
        <>
          <FlatList
            style={{ padding: 4, marginBottom: 8 }}
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
                <View style={{ padding: 10, height: '100%', width: '100%' }}>
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
                position: 'absolute',
                zIndex: 9999,
                width: 60,
                left: width * 0.5 - 30,
                borderRadius: 99,
                bottom: 20,
                backgroundColor: 'black',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 30, marginBottom: 4, textAlign: 'center' }}>
              +
            </Text>
          </Pressable>
        </>
      ) : (
        <SafeAreaProvider>
          <SafeAreaView
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              inset: 0,
            }}
          >
            <Image
              style={{
                width: '100%',
                height: 285,
              }}
              source={require('../../assets/images/home_background.png')}
            />
            <View>
              <Text
                style={{ textAlign: 'center', fontSize: 20, marginBottom: 12, fontWeight: 600 }}
              >
                No Snippets Yet
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 16, color: 'grey', marginBottom: 30 }}>
                Get started by adding a new snippet
              </Text>

              <Pressable
                onPress={() => setCreateOpen(true)}
                style={({ pressed }) => [
                  {
                    height: 52,
                    width: 300,
                    marginBottom: 8,
                    borderRadius: 9999,
                    backgroundColor: '#4D88E9',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '600' }}>
                  + Add entry
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      )}

      {createOpen && (
        <CreateEntryForm visible={createOpen} setVisible={setCreateOpen} onSubmit={handleCreate} />
      )}
    </View>
  )
}
