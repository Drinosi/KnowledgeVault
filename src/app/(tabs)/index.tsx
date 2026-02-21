import 'react-native-get-random-values'

import { useEffect, useState, useMemo } from 'react'
import { Text, View, SectionList, Image, Pressable, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'

import { v4 as uuidv4 } from 'uuid'

import { router } from 'expo-router'

import { runMigrations } from '../../db/migrations'
import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'

import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { addEntry, setEntries } from '../../store/slices/entriesSlice'

import SnippetCard from '../../components/SnippetCard'
import FilterAndSearch from '../../components/FilterAndSearch'

import useIsDarkMode from '../../hooks/useIsDarkMode'

export default function App() {
  const { darkMode } = useIsDarkMode()
  const styles = useMemo(() => createStyles(darkMode), [darkMode])
  const dispatch: AppDispatch = useDispatch()

  const [searchQuery, setSearchQuery] = useState('')

  const entries = useSelector((state: RootState) => state.entries.entries)

  const [filteredEntries, setFilteredEntries] = useState<Entry[]>(entries)

  const sections = useMemo(() => {
    const now = new Date()

    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)

    const startOfYesterday = new Date(startOfToday)
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)

    const startOf7DaysAgo = new Date(startOfToday)
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 7)

    const startOf30DaysAgo = new Date(startOfToday)
    startOf30DaysAgo.setDate(startOf30DaysAgo.getDate() - 30)

    const groups = {
      today: [] as Entry[],
      yesterday: [] as Entry[],
      past7: [] as Entry[],
      past30: [] as Entry[],
      older: [] as Entry[],
    }

    filteredEntries.forEach((entry: Entry) => {
      const dateToCompare = entry.updatedAt ? new Date(entry.updatedAt) : new Date(entry.createdAt)

      if (dateToCompare >= startOfToday) {
        groups.today.push(entry)
      } else if (dateToCompare >= startOfYesterday) {
        groups.yesterday.push(entry)
      } else if (dateToCompare >= startOf7DaysAgo) {
        groups.past7.push(entry)
      } else if (dateToCompare >= startOf30DaysAgo) {
        groups.past30.push(entry)
      } else {
        groups.older.push(entry)
      }
    })

    return [
      { title: 'Today', data: groups.today },
      { title: 'Yesterday', data: groups.yesterday },
      { title: 'Past 7 Days', data: groups.past7 },
      { title: 'Past 30 Days', data: groups.past30 },
      { title: 'Older', data: groups.older },
    ].filter(section => section.data.length > 0)
  }, [filteredEntries])

  useEffect(() => {
    ;(async () => {
      await runMigrations()
      const results = await EntryRepository.getAll(100, 0)

      dispatch(setEntries(results))
    })()
  }, [dispatch])

  useEffect(() => {
    let data = [...entries]

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      data = data.filter(
        e => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q),
      )
    }

    setFilteredEntries(data)
  }, [entries, searchQuery])

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
    <ScrollView style={styles.wrapper}>
      {entries.length ? (
        <>
          <Text style={{ color: 'black', fontSize: 35, fontWeight: 600 }}>
            {entries.length} notes
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <FilterAndSearch setSearchQuery={setSearchQuery} />

            <Pressable
              onPress={handleCreate}
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, styles.addSnippet]}
            >
              <Text style={styles.addSnippetText}>+</Text>
            </Pressable>
          </View>
          <SectionList
            sections={sections}
            scrollEnabled={false}
            keyExtractor={item => item.id}
            renderSectionHeader={({ section }) => (
              <>
                <Text
                  style={{
                    color: darkMode ? 'white' : '#1a1a1a',
                    fontSize: 28,
                    fontWeight: 500,
                    marginBottom: 12,
                    marginTop: 24,
                  }}
                >
                  {section.title}
                </Text>

                <View style={styles.sectionContainer}>
                  {section.data.map((item, index) => (
                    <SnippetCard
                      length={section.data.length}
                      index={index}
                      key={item.id}
                      item={item}
                    />
                  ))}
                </View>
              </>
            )}
            renderItem={() => null}
          />
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
    </ScrollView>
  )
}

const createStyles = (darkMode: boolean) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      padding: 20,
      backgroundColor: darkMode ? 'black' : 'white',
    },
    grid: {
      marginBottom: 8,
    },
    addSnippet: {
      height: 60,
      width: 60,
      borderRadius: 99,
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
    sectionContainer: {
      borderRadius: 16,
      padding: 10,
      marginBottom: 20,
      backgroundColor: darkMode ? '#1a1a1a' : '#f3f3f7',
      overflow: 'hidden',
    },
  })
