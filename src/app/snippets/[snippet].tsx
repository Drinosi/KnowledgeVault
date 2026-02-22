import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet } from 'react-native'

import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'

import Markdown from 'react-native-markdown-display'

import { AppDispatch } from '../../store'
import { useDispatch } from 'react-redux'
import { updateEntry } from '../../store/slices/entriesSlice'

import { useSelector } from 'react-redux'
import { RootState } from '../../store'

import useIsDarkMode from '../../hooks/useIsDarkMode'

import { setUnlocked } from '../../store/slices/securitySlice'

import * as LocalAuthentication from 'expo-local-authentication'

const authenticate = async () => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to view snippets',
    fallbackLabel: 'Use passcode',
    disableDeviceFallback: false,
  })

  return result.success
}

export default function SnippetDetails() {
  const [data, setData] = useState<Entry>()
  const params = useLocalSearchParams()

  const [isPreview, setIsPreview] = useState(true)

  const dispatch: AppDispatch = useDispatch()
  const navigation = useNavigation()

  const [content, setContent] = useState('')

  const { darkMode } = useIsDarkMode()
  const styles = createStyles(darkMode)

  const unlocked = useSelector((state: RootState) => state.security.unlocked)

  useEffect(() => {
    const runAuth = async () => {
      if (unlocked || !data?.locked) return

      const ok = await authenticate()

      if (ok) {
        dispatch(setUnlocked(true))
      } else {
        navigation.goBack()
      }
    }

    runAuth()
  }, [unlocked, dispatch, navigation, data])

  useEffect(() => {
    if (!data) return
    if (!data?.content) {
      setIsPreview(false)
    }
  }, [data])

  useEffect(() => {
    navigation.setOptions({ title: data?.title || 'Untitled' })
  }, [data?.title, navigation])

  useEffect(() => {
    ;(async () => {
      const response = await EntryRepository.getById(params.snippet as string)

      if (response) {
        setData(response)
        if (response.title && !response.content) {
          setContent(response.title)
        } else {
          setContent(
            response.content && response.title ? response.title + '\n' + response.content : '',
          )
        }
      }
    })()
  }, [params.snippet])

  const hasChanges = useCallback(() => {
    if (!data) return false

    const combinedOriginal = data.title + '\n' + data.content

    if (combinedOriginal.length && content.length) return combinedOriginal !== content
  }, [content, data])

  const saveChanges = useCallback(async () => {
    if (!data || !hasChanges()) return

    const entryId = Array.isArray(params.snippet) ? params.snippet[0] : params.snippet

    const lines = content.split('\n')
    const newTitle = lines[0]
    const newContent = lines.slice(1).join('\n')

    const changes: Partial<Entry> = {
      title: newTitle,
      content: newContent,
    }

    await EntryRepository.update(entryId, changes)

    const updatedEntry: Entry = {
      ...data,
      ...changes,
      updatedAt: Date.now(),
    }

    dispatch(updateEntry(updatedEntry))
    setData(updatedEntry)
    setIsPreview(true)
  }, [content, data, dispatch, hasChanges, params.snippet])

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async () => {
      if (hasChanges()) {
        await saveChanges()
      }
    })

    return unsubscribe
  }, [content, data, navigation, hasChanges, saveChanges])

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text>There was a problem showing this Entry</Text>
      </View>
    )
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.dateText}>
            {new Date(data.createdAt).toLocaleString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          {data.updatedAt && (
            <Text style={styles.dateText}>
              Last updated on{' '}
              {new Date(data.updatedAt).toLocaleString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}

          {isPreview ? (
            <Pressable onPress={() => setIsPreview(false)}>
              <View style={styles.contentContainer}>
                <View>
                  {data.title && <Markdown style={styles}>{data.title}</Markdown>}
                  <Markdown style={styles}>{data.content}</Markdown>
                </View>
              </View>
            </Pressable>
          ) : (
            <Pressable>
              <TextInput
                placeholder="Start typing... first line will be used as title"
                placeholderTextColor="grey"
                style={styles.contentInput}
                value={content}
                onChangeText={setContent}
                multiline
                autoFocus
              />
            </Pressable>
          )}
        </ScrollView>
      </View>
    </>
  )
}

const createStyles = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#1a1a1a' : 'white',
      padding: 20,
    },

    scrollContent: {
      flexGrow: 1,
    },

    dateText: {
      fontSize: 10,
      marginBottom: 2,
      color: darkMode ? 'white' : 'grey',
    },

    contentContainer: {
      marginTop: 20,
      backgroundColor: darkMode ? '#1a1a1a' : 'white',
    },

    contentInput: {
      backgroundColor: darkMode ? '#1a1a1a' : 'white',
      marginBottom: 20,
      marginTop: 20,
      height: '100%',
      textAlignVertical: 'top',
      color: darkMode ? 'white' : '#1a1a1a',
    },
    errorContainer: {
      padding: 20,
    },
    heading1: {
      color: darkMode ? 'white' : '#1a1a1a',
    },
    heading2: {
      color: darkMode ? 'white' : '#1a1a1a',
    },
    heading3: {
      color: darkMode ? 'white' : '#1a1a1a',
    },
    heading5: {
      color: darkMode ? 'white' : '#1a1a1a',
    },
    heading6: {
      color: darkMode ? 'white' : '#1a1a1a',
    },
    paragraph: {
      color: darkMode ? 'white' : '#1a1a1a',
    },
    bullet_list: {
      color: darkMode ? 'white' : '#1a1a1a',
    },
    order_list: {
      color: darkMode ? 'white' : '#1a1a1a',
    },
    hr: {
      color: darkMode ? 'white' : '#1a1a1a',
    },
  })
