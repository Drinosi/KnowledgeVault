import React, { useState, useEffect, useMemo } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

import useIsDarkMode from '../hooks/useIsDarkMode'

type Props = {
  setSearchQuery: (query: string) => void
}

const FilterAndSearch = ({ setSearchQuery }: Props) => {
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
        placeholderTextColor={darkMode ? '#a2a6b1' : '#1a1a1a'}
        value={inputValue}
        onChangeText={setInputValue}
      />
    </View>
  )
}

const createStyles = (darkMode: boolean) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 23,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: darkMode ? '#676c7c' : 'lightgrey',
      flex: 1,
    },
    input: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      color: darkMode ? 'white' : '#1a1a1a',
      borderColor: darkMode ? 'white' : 'lightgrey',
      backgroundColor: darkMode ? '#1a1a1a' : '#f3f3f7',
      borderRadius: 4,
      flex: 1,
    },
  })

export default FilterAndSearch
