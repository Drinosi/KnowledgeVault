import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, Pressable, TextInput, Image, ScrollView, StyleSheet } from 'react-native'

import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'

import Markdown from 'react-native-markdown-display'

import { AppDispatch } from '../../store'
import { useDispatch } from 'react-redux'
import { updateEntry } from '../../store/slices/entriesSlice'

export default function SnippetDetails() {
  const [data, setData] = useState<Entry>()
  const [editOpen, setEditOpen] = useState(false)

  const dispatch: AppDispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<'snippet' | 'concept' | 'link'>('snippet')
  const [language, setLanguage] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [edited, setEdited] = useState(false)

  const params = useLocalSearchParams()

  useEffect(() => {
    ;(async () => {
      const response = await EntryRepository.getById(params.snippet as string)

      if (response) {
        setData(response)
        setTitle(response.title)
        setContent(response.content)
        setType(response.type)
        setLanguage(response.language ?? '')
        setSourceUrl(response.sourceUrl ?? '')
      }
    })()
  }, [edited])

  async function handleEdit() {
    if (!data) return

    const entryId = Array.isArray(params.snippet) ? params.snippet[0] : params.snippet
    const changes: Partial<Entry> = {
      title,
      content,
      type,
      language,
      sourceUrl,
    }

    const hasChanges =
      data.title !== title ||
      data.content !== content ||
      data.type !== type ||
      (data.language ?? '') !== language ||
      (data.sourceUrl ?? '') !== sourceUrl

    if (!hasChanges) {
      setEditOpen(false)
      return
    }

    await EntryRepository.update(entryId, changes)

    const updatedEntry: Entry = {
      ...data,
      ...changes,
      updatedAt: Date.now(),
    }

    dispatch(updateEntry(updatedEntry))
    setEdited(prev => !prev)
  }

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
        }}
      />

      <View style={styles.container}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Image style={styles.image} source={require('../../assets/images/home_background.png')} />

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

          {!editOpen ? (
            <Text style={styles.title}>{data.title}</Text>
          ) : (
            <TextInput
              placeholderTextColor="grey"
              placeholder={data.title}
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
            />
          )}

          {!editOpen ? (
            <View style={styles.contentContainer}>
              <Markdown>{data.content}</Markdown>
            </View>
          ) : (
            <TextInput
              placeholderTextColor="grey"
              placeholder={data.content}
              style={styles.contentInput}
              value={content}
              onChangeText={setContent}
              multiline
            />
          )}
        </ScrollView>

        {editOpen && (
          <Pressable onPress={() => setEditOpen(false)} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel edit</Text>
          </Pressable>
        )}

        <Pressable
          onPress={async () => {
            if (editOpen) {
              await handleEdit()
              setEditOpen(false)
            } else {
              setEditOpen(true)
            }
          }}
          style={[styles.editButton, editOpen ? styles.finishButton : styles.startEditButton]}
        >
          <Text style={styles.editButtonText}>{editOpen ? 'Finish Edit' : 'Edit Snippet'}</Text>
        </Pressable>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    padding: 20,
    marginTop: 20,
  },

  scrollContent: {
    flexGrow: 1,
  },

  image: {
    width: 150,
    height: 150,
    marginTop: -20,
  },

  dateText: {
    fontSize: 14,
    marginTop: 12,
    color: 'grey',
  },

  title: {
    fontSize: 32,
  },

  titleInput: {
    padding: 20,
    borderRadius: 20,
    fontSize: 32,
    backgroundColor: 'white',
    marginTop: 20,
  },

  contentContainer: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginBottom: 40,
    marginTop: 20,
  },

  contentInput: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    marginBottom: 40,
    marginTop: 20,
  },

  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 20,
    padding: 20,
    margin: 20,
  },

  cancelButtonText: {
    color: '#1a1a1a',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  editButton: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },

  startEditButton: {
    backgroundColor: 'orangered',
  },

  finishButton: {
    backgroundColor: 'green',
  },

  editButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  errorContainer: {
    padding: 20,
  },
})
