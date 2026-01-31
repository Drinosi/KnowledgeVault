import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, Pressable, TextInput, Image, ScrollView } from 'react-native'

import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'
import Markdown from 'react-native-markdown-display'

import { AppDispatch } from '../../store'
import { useDispatch } from 'react-redux'
import { updateEntry } from '../../store/slices/entriesSlice'

export default function EntryDetails() {
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
      const response = await EntryRepository.getById(params.entry as string)
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

    const entryId = Array.isArray(params.entry) ? params.entry[0] : params.entry
    const changes: Partial<Entry> = {
      title,
      content,
      type,
      language,
      sourceUrl,
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

  if (!data)
    return (
      <View style={{ padding: 20 }}>
        <Text>There was a problem showing this Entry</Text>
      </View>
    )

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.title ?? 'Loading...',
          headerBackVisible: false,
        }}
      />
      <ScrollView style={{ padding: 20, marginTop: 20 }}>
        <Image
          style={{ width: 150, marginTop: -20, height: 150 }}
          source={require('../../assets/images/home_background.png')}
        />
        {!editOpen ? (
          <>
            <Text style={{ fontSize: 32 }}>{data.title}</Text>
            <Text style={{ fontSize: 14, marginTop: 12, color: 'grey' }}>
              {new Date(data.createdAt).toLocaleString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {data.updatedAt && (
              <Text style={{ fontSize: 14, marginTop: 4, color: 'grey' }}>
                Last updated on{' '}
                {new Date(data.createdAt).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
          </>
        ) : (
          <TextInput
            placeholderTextColor="grey"
            placeholder={data.title}
            style={{ backgroundColor: 'white', padding: 10, margin: 8, color: 'black' }}
            value={title}
            onChangeText={setTitle}
          />
        )}

        {!editOpen ? (
          <View
            style={{
              padding: 20,
              borderRadius: 20,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: 'lightgrey',
              marginBottom: 40,
              marginTop: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 3.84,
            }}
          >
            <Markdown>{data.content}</Markdown>
          </View>
        ) : (
          <TextInput
            placeholderTextColor="grey"
            placeholder={data.content}
            style={{
              backgroundColor: 'white',
              padding: 10,
              margin: 8,
              color: 'black',
              minHeight: 100,
            }}
            value={content}
            onChangeText={setContent}
            multiline
          />
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
          style={{ backgroundColor: editOpen ? 'green' : 'orangered', padding: 20, marginTop: 12 }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            {editOpen ? 'Save' : 'Edit'}
          </Text>
        </Pressable>
      </ScrollView>
    </>
  )
}
