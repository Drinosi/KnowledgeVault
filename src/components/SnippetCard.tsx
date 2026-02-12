import { useMemo } from 'react'

import { View, Text, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { Entry } from '../domain/Entry'

import useIsDarkMode from '../hooks/useIsDarkMode'

type SnippetCardProps = {
  item: Entry
}

const SnippetCard = ({ item }: SnippetCardProps) => {
  const { darkMode } = useIsDarkMode()
  const styles = useMemo(() => createStyles(darkMode), [darkMode])

  return (
    <Link style={styles.card} href={`/snippets/${item.id}`}>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.content}</Text>

        <Text style={styles.date}>
          Created on {new Date(Number(item.createdAt)).toDateString()}
        </Text>
        <Text style={styles.date}>
          {item.updatedAt && `Last updated on ${new Date(Number(item.updatedAt)).toDateString()}`}
        </Text>
      </View>
    </Link>
  )
}

export default SnippetCard

const createStyles = (darkMode: boolean) =>
  StyleSheet.create({
    card: {
      margin: 6,
      maxHeight: 200,
      backgroundColor: darkMode ? '#1a1a1a' : 'white',
      borderWidth: darkMode ? 1 : 0,
      borderColor: darkMode ? 'white' : '#1a1a1a',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
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
