import React, { useState, useEffect } from 'react'
import { View, TextInput, Pressable, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

type Props = {
  sortAscending: boolean
  setSortAscending: (sortAscending: boolean) => void
  setSearchQuery: (query: string) => void
}

const FilterAndSearch = ({ sortAscending, setSortAscending, setSearchQuery }: Props) => {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 300)

    return () => clearTimeout(handler)
  }, [inputValue, setSearchQuery])

  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder="Search snippets"
        style={styles.input}
        placeholderTextColor={'#cccr'}
        value={inputValue}
        onChangeText={setInputValue}
      />

      <Pressable style={styles.button} onPress={() => setSortAscending(!sortAscending)}>
        <MaterialCommunityIcons
          name={sortAscending ? 'sort-calendar-ascending' : 'sort-calendar-descending'}
          size={24}
          color="black"
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
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
    color: 'black',
    backgroundColor: 'white',
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
