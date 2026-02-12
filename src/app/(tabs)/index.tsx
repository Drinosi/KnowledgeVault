import 'react-native-get-random-values'

import { useEffect, useState, useMemo } from 'react'
import { Text, View, FlatList, Image, Pressable, Dimensions, StyleSheet } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { v4 as uuidv4 } from 'uuid'
import { router } from 'expo-router'
import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'

import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { addEntry, setEntries } from '../../store/slices/entriesSlice'

import SnippetCard from '../../components/SnippetCard'
import FilterAndSearch from '../../components/FilterAndSearch'

import { useColorScheme } from 'react-native'
import { runMigrations } from '../../db/migrations'

const { width } = Dimensions.get('window')

export default function App() {
  const systemScheme = useColorScheme()
  const themeMode = useSelector((state: RootState) => state.theme.mode)
  const darkMode = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark')
  const styles = useMemo(() => createStyles(darkMode), [darkMode])

  const dispatch: AppDispatch = useDispatch()

  const [searchQuery, setSearchQuery] = useState('')
  const [sortAscending, setSortAscending] = useState(false)

  const entries = useSelector((state: RootState) => state.entries.entries)
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>(entries)

  useEffect(() => {
    ;(async () => {
      await runMigrations()
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

  const handleCreate = async () => {
    const now = Date.now()

    const newEntry: Entry = {
      id: uuidv4(),
      title: '',
      content: '',
      language: '',
      createdAt: now,
      updatedAt: null,
    }

    await EntryRepository.create(newEntry)

    dispatch(addEntry(newEntry))

    router.push(`/snippets/${newEntry.id}`)
  }

  return (
    <View style={styles.wrapper}>
      {entries.length ? (
        <>
          <FilterAndSearch
            sortAscending={sortAscending}
            setSearchQuery={setSearchQuery}
            setSortAscending={setSortAscending}
          />
          <FlatList
            style={styles.grid}
            data={filteredEntries}
            keyExtractor={item => item.id}
            numColumns={1}
            renderItem={({ item }) => <SnippetCard item={item} />}
          />
          <Pressable
            onPress={handleCreate}
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, styles.addSnippet]}
          >
            <Text style={styles.addSnippetText}>+</Text>
          </Pressable>
        </>
      ) : (
        <SafeAreaProvider>
          <SafeAreaView style={styles.emptyStateWrapper}>
            <Image
              style={styles.homeImage}
              source={require('../../assets/images/home_background.png')}
            />
            <View>
              <Text style={styles.noSnippetsText}>No Snippets Yet</Text>
              <Text style={styles.noSnippetsDescription}>Get started by adding a new snippet</Text>

              <Pressable
                onPress={handleCreate}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.85 : 1,
                  },
                  styles.emptyAddSnippet,
                ]}
              >
                <Text style={styles.emptyAddSnippetText}>+ Add entry</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      )}
    </View>
  )
}

const createStyles = (darkMode: boolean) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: darkMode ? '#1a1a1a' : 'white',
    },
    grid: {
      padding: 4,
      marginBottom: 8,
    },
    addSnippet: {
      height: 60,
      position: 'absolute',
      zIndex: 9999,
      width: 60,
      left: width * 0.5 - 30,
      borderRadius: 99,
      bottom: 20,
      backgroundColor: darkMode ? 'white' : '#4D88E9',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addSnippetText: {
      color: darkMode ? '#1a1a1a' : 'white',
      fontSize: 30,
      marginBottom: 4,
      textAlign: 'center',
    },
    emptyStateWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      inset: 0,
    },
    homeImage: {
      width: '100%',
      height: 450,
    },
    noSnippetsText: {
      textAlign: 'center',
      fontSize: 20,
      marginBottom: 12,
      fontWeight: 600,
      color: darkMode ? 'white' : '#1a1a1a',
    },
    noSnippetsDescription: {
      textAlign: 'center',
      fontSize: 16,
      color: darkMode ? 'white' : 'grey',
      marginBottom: 30,
    },
    emptyAddSnippet: {
      height: 52,
      width: 300,
      marginBottom: 8,
      borderRadius: 9999,
      backgroundColor: darkMode ? 'white' : '#4D88E9',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyAddSnippetText: {
      color: darkMode ? '#1a1a1a' : 'white',
      fontSize: 20,
      fontWeight: '600',
    },
  })
