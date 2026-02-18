import { useMemo } from 'react'

import { View, Text, StyleSheet } from 'react-native'
import { Link } from 'expo-router'

import { Entry } from '../domain/Entry'

import useIsDarkMode from '../hooks/useIsDarkMode'

type SnippetCardProps = {
  item: Entry
  index: number
  length: number
}

const SnippetCard = ({ item, index, length }: SnippetCardProps) => {
  const { darkMode } = useIsDarkMode()
  const styles = useMemo(() => createStyles(darkMode, index, length), [darkMode, index, length])

  let displayDate = ''
  if (item.updatedAt || item.createdAt) {
    const dateToCheck = item.updatedAt ? item.updatedAt : item.createdAt
    const date = new Date(Number(dateToCheck))
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const oneWeek = 7 * 24 * 60 * 60 * 1000

    if (diff < oneWeek) {
      const day = date.toLocaleDateString(undefined, { weekday: 'long' })
      const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      displayDate = `${day} ${time}`
    } else {
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear().toString().slice(-2)
      displayDate = `${day}.${month}.${year}`
    }
  }

  return (
    <Link style={styles.card} href={`/snippets/${item.id}`}>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title.length ? item.title : 'Untitled'}</Text>

        <Text style={styles.date}>
          {`${displayDate} ${item.content ? '' : ' No additonal text'}`}
        </Text>
      </View>
    </Link>
  )
}

export default SnippetCard

const createStyles = (darkMode: boolean, index: number, length: number) =>
  StyleSheet.create({
    card: {
      maxHeight: 200,
      borderBottomWidth: index !== length - 1 ? 1 : 0,
      borderBottomColor: darkMode ? '#676c7c' : 'lightgrey',
    },

    content: {
      padding: 10,
      width: '100%',
    },

    title: {
      color: darkMode ? 'white' : '#1a1a1a',
      fontSize: 20,
      marginBottom: 4,
    },

    description: {
      color: darkMode ? 'white' : '#676c7c',
      fontSize: 14,
      marginBottom: 8,
    },

    date: {
      color: darkMode ? 'white' : '#b6b6b6',
      fontSize: 12,
    },
  })
