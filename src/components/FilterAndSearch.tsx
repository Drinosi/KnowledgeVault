import React, { useState, useEffect, useMemo } from 'react'
import { View, TextInput, Pressable, StyleSheet } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import useIsDarkMode from '../hooks/useIsDarkMode'

type Props = {
  sortAscending: boolean
  setSortAscending: (sortAscending: boolean) => void
  setSearchQuery: (query: string) => void
}

const FilterAndSearch = ({ sortAscending, setSortAscending, setSearchQuery }: Props) => {
  const [inputValue, setInputValue] = useState('')

  const { darkMode } = useIsDarkMode()

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 300)

    return () => clearTimeout(handler)
  }, [inputValue, setSearchQuery])

  const styles = useMemo(() => createStyles(darkMode), [darkMode])

  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder="Search snippets"
        style={styles.input}
        placeholderTextColor={darkMode ? 'white' : '#1a1a1a'}
        value={inputValue}
        onChangeText={setInputValue}
      />

      <Pressable style={styles.button} onPress={() => setSortAscending(!sortAscending)}>
        <MaterialCommunityIcons
          name={sortAscending ? 'sort-calendar-ascending' : 'sort-calendar-descending'}
          size={24}
          style={styles.icon}
        />
      </Pressable>
    </View>
  )
}

const createStyles = (darkMode: boolean) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
    },
    input: {
      flex: 1,
      padding: 14,
      marginRight: 8,
      color: darkMode ? 'white' : '#1a1a1a',
      backgroundColor: darkMode ? '#1a1a1a' : 'white',
      borderBottomWidth: 1,
      borderColor: darkMode ? 'white' : 'lightgrey',
    },
    button: {
      padding: 12,
      backgroundColor: darkMode ? '#1a1a1a' : 'white',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      color: darkMode ? 'white' : '#1a1a1a',
    },
  })

export default FilterAndSearch
