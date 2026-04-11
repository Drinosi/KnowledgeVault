import { View, Text, Pressable, StyleSheet, Animated } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { TagRepository } from '../repositories/TagRepository'
import { Tag } from '../domain/Tag'
import useIsDarkMode from '../hooks/useIsDarkMode'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { toggleSidebar } from '../store/slices/sideBarSlice'

const SIDEBAR_WIDTH = 200

const stringToColor = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 70%, 55%)`
}

const TagsSideBar = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const open = useSelector((state: RootState) => state.sidebar.opened)
  const { darkMode } = useIsDarkMode()
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current

  useEffect(() => {
    if (!open) return
    const fetchTags = async () => {
      const result = await TagRepository.getAll()
      setTags(result || [])
    }

    fetchTags()
  }, [open])

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: open ? 0 : -SIDEBAR_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [open])

  const styles = useMemo(() => createStyles(darkMode), [darkMode])

  const tagColors = useMemo(() => {
    const map: Record<string, string> = {}
    tags.forEach(tag => {
      map[tag.id] = stringToColor(tag.id)
    })
    return map
  }, [tags])

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
      <Text style={{ color: 'white', fontSize: 18, marginBottom: 20 }}>Your tags</Text>
      {tags.length ? (
        tags.map(tag => (
          <View key={tag.id} style={styles.tagRow}>
            <View style={[styles.dot, { backgroundColor: tagColors[tag.id] }]} />
            <Text style={styles.tagText}>{tag.name.split('#')[1]}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>You have not created any tags</Text>
      )}
    </Animated.View>
  )
}

const createStyles = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      zIndex: 1000,
      bottom: 0,
      top: 0,
      left: 0,
      width: SIDEBAR_WIDTH,
      flex: 1,
      padding: 20,
      backgroundColor: darkMode ? '#1a1a1a' : '#fff',
      height: '100%',
    },

    tagRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },

    tagText: {
      fontSize: 16,
      color: darkMode ? '#eee' : '#1a1a1a',
    },

    emptyText: {
      color: darkMode ? '#aaa' : '#1a1a1a',
    },

    closeText: {
      color: darkMode ? '#fff' : '#000',
      marginBottom: 10,
    },
  })

export default TagsSideBar
