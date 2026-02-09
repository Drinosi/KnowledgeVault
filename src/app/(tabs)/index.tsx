import 'react-native-get-random-values'

import { useEffect, useState } from 'react'
import { Text, View, FlatList, Image, Pressable, Dimensions } from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { v4 as uuidv4 } from 'uuid'

import CreateSnippetModal from '../../components/CreateSnippet'
import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'
import { runMigrations } from '../../db/migrations'

import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { addEntry, setEntries } from '../../store/slices/entriesSlice'

import SnippetCard from '../../components/SnippetCard'
import FilterAndSearch from '../../components/FilterAndSearch'

const { width } = Dimensions.get('window')

export default function App() {
  const dispatch: AppDispatch = useDispatch()

  const [createOpen, setCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortAscending, setSortAscending] = useState(false)

  const entries = useSelector((state: RootState) => state.entries.entries)
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>(entries)

  useEffect(() => {
    ;(async () => {
      const results = await EntryRepository.getAll(100, 0, sortType)

      dispatch(setEntries(results))
    })()
  }, [sortAscending, searchQuery])

  const sortType = sortAscending ? 'ASC' : 'DESC'

  useEffect(() => {
    let data = [...entries]

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      data = data.filter(
        e => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q),
      )
    }

    data.sort((a, b) => {
      const aTime = a.updatedAt ?? a.createdAt
      const bTime = b.updatedAt ?? b.createdAt
      return sortAscending ? aTime - bTime : bTime - aTime
    })

    setFilteredEntries(data)
  }, [entries, searchQuery, sortAscending])

  const handleCreate = async (entryData: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now()
    const newEntry: Entry = {
      id: uuidv4(),
      createdAt: now,
      ...entryData,
      updatedAt: null,
    }

    await EntryRepository.create(newEntry)

    dispatch(addEntry(newEntry))

    setCreateOpen(false)
  }

  return (
    <View style={{ flex: 1 }}>
      {entries.length ? (
        <>
          <FilterAndSearch
            sortAscending={sortAscending}
            setSearchQuery={setSearchQuery}
            setSortAscending={setSortAscending}
          />
          <FlatList
            style={{ padding: 4, marginBottom: 8 }}
            data={filteredEntries}
            keyExtractor={item => item.id}
            numColumns={1}
            renderItem={({ item }) => <SnippetCard item={item} />}
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
                backgroundColor: '#4D88E9',
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

      <View style={{ display: `${createOpen ? 'flex' : 'none'}` }}>
        <CreateSnippetModal
          visible={createOpen}
          setVisible={setCreateOpen}
          onSubmit={handleCreate}
        />
      </View>
    </View>
  )
}
