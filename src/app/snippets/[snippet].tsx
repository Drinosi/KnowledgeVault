import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useCallback, useEffect, useState, useRef } from 'react'
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet } from 'react-native'

import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'

import { FontAwesome6 } from '@expo/vector-icons'

import Markdown from 'react-native-markdown-display'

import { AppDispatch } from '../../store'
import { useDispatch } from 'react-redux'
import { updateEntry } from '../../store/slices/entriesSlice'

import { useSelector } from 'react-redux'
import { RootState } from '../../store'

import useIsDarkMode from '../../hooks/useIsDarkMode'

import { setUnlocked } from '../../store/slices/securitySlice'

import * as LocalAuthentication from 'expo-local-authentication'
import { setNotification } from '../../store/slices/notificationSlice'
import { TagRepository } from '../../repositories/TagRepository'
import { EntryTagRepository } from '../../repositories/EntryTagRepository'

const authenticate = async () => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to view snippets',
    fallbackLabel: 'Use passcode',
    disableDeviceFallback: false,
  })

  return result.success
}

const markdownStyles = (darkMode: boolean) => ({
  body: { color: darkMode ? 'white' : '#1a1a1a' },

  heading1: { color: darkMode ? 'white' : '#1a1a1a' },

  paragraph: { color: darkMode ? 'white' : '#1a1a1a' },

  bullet_list: { color: darkMode ? 'white' : '#1a1a1a' },

  ordered_list: { color: darkMode ? 'white' : '#1a1a1a' },

  fence: {
    backgroundColor: darkMode ? 'white' : 'lightgrey',
    color: '#1a1a1a',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    fontFamily: 'Courier',
    fontSize: 14,
    marginVertical: 5,
  },

  code_inline: {
    backgroundColor: darkMode ? 'white' : 'lightgrey',
    color: '#1a1a1a',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontFamily: 'Courier',
  },
})

export default function SnippetDetails() {
  const [data, setData] = useState<Entry>()
  const params = useLocalSearchParams()
  const [content, setContent] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)

  console.log(params)

  const dispatch: AppDispatch = useDispatch()
  const navigation = useNavigation()

  const { darkMode } = useIsDarkMode()
  const styles = createStyles(darkMode)

  const unlocked = useSelector((state: RootState) => state.security.unlocked)

  const parseContent = (value: string) => {
    const lines = value.split('\n')
    const title = lines[0] || ''
    const body = lines.slice(1).join('\n')
    return { title, body }
  }

  const { title, body } = parseContent(content)

  function autoSave(value: string) {
    setContent(value)

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }
    typingTimeout.current = setTimeout(() => {
      saveChanges(value)
    }, 2000)
  }

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
    if (!data.content && !data.title) {
      setIsPreview(false)
    }
  }, [data])

  useEffect(() => {
    navigation.setOptions({ title: data?.title || 'Untitled' })
  }, [data?.title, navigation])

  useEffect(() => {
    ;(async () => {
      try {
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
      } catch (error: any) {
        dispatch(setNotification({ type: 'error', message: error.message }))
      }
    })()
  }, [params.snippet])

  const hasChanges = useCallback(() => {
    if (!data) return false
    return content !== `${data.title}\n${data.content}`
  }, [content, data])

  const saveChanges = useCallback(
    async (value: string) => {
      if (!data) return

      const entryId = Array.isArray(params.snippet) ? params.snippet[0] : params.snippet

      const { title, body } = parseContent(value)

      const catchAllTags = [...new Set(body.match(/(^|\s)(#[a-zA-Z0-9_]+)/g) || [])]

      await Promise.all(
        catchAllTags.map(tag =>
          TagRepository.create({
            id: uuidv4(),
            name: tag,
          }),
        ),
      )

      await Promise.all(
        catchAllTags.map(async tagName => {
          const tag = await TagRepository.findByName(tagName)
          console.log(tag)

          await EntryTagRepository.create({
            entry_id: params.snippet,
            tag_id: tag?.id,
          })
        }),
      )

      if (title === data.title && body === data.content) return

      const changes: Partial<Entry> = {
        title,
        content: body,
      }

      const updatedEntry: Entry = {
        ...data,
        ...changes,
        updatedAt: Date.now(),
      }

      await EntryRepository.update(entryId, changes)

      dispatch(updateEntry(updatedEntry))
      setData(updatedEntry)
    },
    [data, dispatch, params.snippet],
  )

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async () => {
      if (hasChanges()) {
        await saveChanges(content)
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
          <Pressable
            onPress={() => setIsPreview(prev => !prev)}
            style={{ position: 'absolute', right: 0, zIndex: 9999 }}
          >
            <FontAwesome6 name={isPreview ? 'eye-slash' : 'eye'} size={20} color="white" />
          </Pressable>
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
                  {title && <Markdown style={markdownStyles(darkMode)}>{title}</Markdown>}
                  <Markdown style={markdownStyles(darkMode)}>{body}</Markdown>
                </View>
              </View>
            </Pressable>
          ) : (
            <Pressable>
              <TextInput
                placeholder="Simply start typing."
                placeholderTextColor="grey"
                style={styles.contentInput}
                value={content}
                onChangeText={autoSave}
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
    hr: {
      color: darkMode ? 'white' : '#1a1a1a',
    },
  })
