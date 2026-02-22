import { useMemo, useState } from 'react'

import { View, Text, StyleSheet, Pressable } from 'react-native'

import { FontAwesome } from '@expo/vector-icons'
import { Entry } from '../domain/Entry'

import { router } from 'expo-router'

import { RootState } from '../store'
import { useSelector } from 'react-redux'
import SnippetActions from './SnippetActions'

type SnippetCardProps = {
  item: Entry
  index: number
  length: number
  darkMode: boolean
}

const SnippetCard = ({ darkMode, item, index, length }: SnippetCardProps) => {
  const [modalOpen, setModalOpen] = useState(false)

  const styles = useMemo(() => createStyles(darkMode, index, length), [darkMode, index, length])

  const unlocked = useSelector((state: RootState) => state.security.unlocked)

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
    <View>
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/snippets/${item.id}`)}
        onLongPress={() => setModalOpen(prev => !prev)}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{item.title.length ? item.title : 'Untitled'}</Text>

          <Text style={styles.date}>
            {`${displayDate} ${item.content ? '' : ' No additonal text'}`}
          </Text>
        </View>
        {item.locked !== null && (
          <FontAwesome
            style={{ position: 'absolute', right: 20, top: 20 }}
            name={item.locked === 1 && !unlocked ? 'lock' : unlocked ? 'unlock' : null}
            size={22}
            color="grey"
          />
        )}
      </Pressable>
      <SnippetActions
        item={item}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        darkMode={darkMode}
      />
    </View>
  )
}

export default SnippetCard

const createStyles = (darkMode: boolean, index: number, length: number) =>
  StyleSheet.create({
    card: {
      maxHeight: 200,
      position: 'relative',
      borderBottomWidth: index !== length - 1 ? 1 : 0,
      borderBottomColor: darkMode ? '#676c7c' : 'lightgrey',
      backgroundColor: darkMode ? '#1a1a1a' : '#f3f3f7',
      borderTopRightRadius: index === 0 ? 10 : 0,
      borderTopLeftRadius: index === 0 ? 10 : 0,
      borderBottomLeftRadius: index === length - 1 ? 10 : 0,
      borderBottomRightRadius: index === length - 1 ? 10 : 0,
    },
    content: {
      padding: 10,
      width: '100%',
    },
    title: {
      color: darkMode ? '#a2a6b1' : '#1a1a1a',
      fontSize: 18,
      marginBottom: 4,
    },
    description: {
      color: darkMode ? '#a2a6b1' : '#676c7c',
      fontSize: 12,
      marginBottom: 4,
    },
    date: {
      color: darkMode ? '#a2a6b1' : '#b6b6b6',
      fontSize: 10,
    },
  })
