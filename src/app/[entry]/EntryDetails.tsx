import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, Pressable, TextInput } from 'react-native'

import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'
import Markdown from 'react-native-markdown-display'

export default function EntryDetails() {
  const [data, setData] = useState<Entry>()
  const [editOpen, setEditOpen] = useState(false)

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

    await EntryRepository.update(params.entry as string, {
      title,
      content,
      type,
      language,
      sourceUrl,
    })

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
      <View style={{ padding: 6, marginTop: 100 }}>
        {!editOpen ? (
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{data.title}</Text>
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
          <Markdown>{data.content}</Markdown>
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
      </View>
    </>
  )
}
