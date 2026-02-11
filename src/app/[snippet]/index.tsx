import { Stack, useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native'

import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'

import Markdown from 'react-native-markdown-display'

import { AppDispatch } from '../../store'
import { useDispatch } from 'react-redux'
import { updateEntry } from '../../store/slices/entriesSlice'

import { useSelector } from 'react-redux'
import { RootState } from '../../store'

export default function SnippetDetails() {
  const [data, setData] = useState<Entry>()
  const params = useLocalSearchParams()

  const [isPreview, setIsPreview] = useState(true)

  const dispatch: AppDispatch = useDispatch()
  const navigation = useNavigation()

  const systemScheme = useColorScheme()
  const themeMode = useSelector((state: RootState) => state.theme.mode)
  const darkMode = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark')

  const [content, setContent] = useState('')
  const [type, setType] = useState<'snippet' | 'concept' | 'link'>('snippet')
  const [language, setLanguage] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')

  const styles = createStyles(darkMode)

  useEffect(() => {
    if (!data) return
    if (!data?.content) {
      setIsPreview(false)
    }
  }, [data])

  useEffect(() => {
    ;(async () => {
      const response = await EntryRepository.getById(params.snippet as string)

      if (response) {
        setData(response)
        setContent(
          response.content && response.title ? response.title + '\n' + response.content : '',
        )

        setType(response.type)
        setLanguage(response.language ?? '')
        setSourceUrl(response.sourceUrl ?? '')
      }
    })()
  }, [])

  const hasChanges = () => {
    if (!data) return false

    const combinedOriginal = data.title + '\n' + data.content
    return combinedOriginal !== content
  }

  async function saveChanges() {
    if (!data || !hasChanges()) return

    const entryId = Array.isArray(params.snippet) ? params.snippet[0] : params.snippet

    const lines = content.split('\n')
    const newTitle = lines[0] || 'Untitled'
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
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async () => {
      if (hasChanges()) {
        await saveChanges()
      }
    })

    return unsubscribe
  }, [content, type, language, sourceUrl, data])

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text>There was a problem showing this Entry</Text>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.title ?? 'Loading...',
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: darkMode ? '#1a1a1a' : 'white',
          },
          headerTitleStyle: {
            color: darkMode ? 'white' : 'black',
          },
        }}
      />

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
                <Markdown style={styles}>{data.content}</Markdown>
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
      color: darkMode ? 'white' : 'black',
    },
    errorContainer: {
      padding: 20,
    },
    heading1: {
      color: darkMode ? 'white' : 'black',
    },
    heading2: {
      color: darkMode ? 'white' : 'black',
    },
    heading3: {
      color: darkMode ? 'white' : 'black',
    },
    heading5: {
      color: darkMode ? 'white' : 'black',
    },
    heading6: {
      color: darkMode ? 'white' : 'black',
    },
    paragraph: {
      color: darkMode ? 'white' : 'black',
    },
    bullet_list: {
      color: darkMode ? 'white' : 'black',
    },
    order_list: {
      color: darkMode ? 'white' : 'black',
    },
    hr: {
      color: darkMode ? 'white' : 'black',
    },
  })
