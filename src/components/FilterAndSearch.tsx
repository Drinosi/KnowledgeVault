import React, { useState, useEffect, useMemo } from 'react'
import { View, TextInput, Pressable, StyleSheet, useColorScheme } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

type Props = {
  sortAscending: boolean
  setSortAscending: (sortAscending: boolean) => void
  setSearchQuery: (query: string) => void
}

const FilterAndSearch = ({ sortAscending, setSortAscending, setSearchQuery }: Props) => {
  const [inputValue, setInputValue] = useState('')

  const colorScheme = useColorScheme()
  const darkMode = colorScheme === 'dark'

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
        placeholderTextColor={'white'}
        value={inputValue}
        onChangeText={setInputValue}
      />

      <Pressable style={styles.button} onPress={() => setSortAscending(!sortAscending)}>
        <MaterialCommunityIcons
          name={sortAscending ? 'sort-calendar-ascending' : 'sort-calendar-descending'}
          size={24}
          color="#1a1a1a"
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
      borderRadius: 8,
      padding: 14,
      marginRight: 8,
      color: darkMode ? 'white' : '#1a1a1a',
      backgroundColor: darkMode ? '#1a1a1a' : 'white',
      borderWidth: 1,
      borderColor: darkMode ? 'white' : '#1a1a1a',
    },
    button: {
      padding: 12,
      backgroundColor: 'white',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

export default FilterAndSearch
