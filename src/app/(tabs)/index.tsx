import { useEffect, useState, useMemo } from 'react'
import { Text, View, SectionList, StyleSheet, ScrollView } from 'react-native'

import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'

import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { setEntries } from '../../store/slices/entriesSlice'

import SnippetCard from '../../components/SnippetCard'
import FilterAndSearch from '../../components/FilterAndSearch'

import useIsDarkMode from '../../hooks/useIsDarkMode'

import EmptyStateHome from '../../components/EmptyStateHome'

export default function App() {
  const { darkMode } = useIsDarkMode()
  const styles = useMemo(() => createStyles(darkMode), [darkMode])
  const dispatch: AppDispatch = useDispatch()

  const [searchQuery, setSearchQuery] = useState('')

  const entries = useSelector((state: RootState) => state.entries.entries)

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries
    const q = searchQuery.toLowerCase()
    return entries.filter(
      e => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q),
    )
  }, [entries, searchQuery])

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
      const results = await EntryRepository.getAll(100, 0)

      dispatch(setEntries(results))
    })()
  }, [dispatch])

  return (
    <ScrollView style={styles.wrapper}>
      {entries.length ? (
        <>
          <Text style={styles.title}>{filteredEntries.length} snippets</Text>
          <View style={styles.searchWrapper}>
            <FilterAndSearch setSearchQuery={setSearchQuery} />
          </View>
          <SectionList
            sections={sections}
            ListEmptyComponent={
              <View style={styles.noResultsWrapper}>
                <Text style={styles.noResults}>{`No results for "${searchQuery}"`}</Text>
                <Text style={styles.noResultsText}>Check spelling or try a new search</Text>
              </View>
            }
            keyExtractor={item => item.id}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            )}
            renderItem={({ item, index, section }) => (
              <SnippetCard length={section.data.length} index={index} item={item} />
            )}
          />
        </>
      ) : (
        <EmptyStateHome darkMode={darkMode} />
      )}
    </ScrollView>
  )
}

const createStyles = (darkMode: boolean) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      padding: 15,
      backgroundColor: darkMode ? 'black' : 'white',
    },
    title: {
      color: darkMode ? '#a2a6b1' : 'black',
      fontSize: 24,
      fontWeight: 600,
    },
    searchWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
    },
    sectionTitle: {
      color: darkMode ? '#a2a6b1' : '#1a1a1a',
      fontSize: 20,
      fontWeight: 500,
      marginBottom: 8,
      marginTop: 25,
    },
    noResults: {
      color: darkMode ? 'white' : 'black',
      fontWeight: 600,
      marginVertical: 10,
      paddingTop: 20,
      fontSize: 28,
    },
    noResultsWrapper: {
      alignItems: 'center',
    },
    noResultsText: {
      color: darkMode ? '#a2a6b1' : 'black',
    },
  })
