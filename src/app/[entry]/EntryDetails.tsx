import { Stack, useLocalSearchParams } from 'expo-router'

import { useEffect, useState } from 'react'
import { View, Text, Pressable, TextInput } from 'react-native'

import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'
import Markdown from 'react-native-markdown-display'
import CreateEntryModal from '../../components/CreateEntry'

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
      }
    })()
  }, [edited])

  async function handleEdit() {
    const newEntry: Entry = {
      id: params.entry[0],
      title,
      content,
      type,
      language,
      sourceUrl,
      createdAt: 1,
      updatedAt: 1,
    }
    await EntryRepository.create(newEntry)
    setEdited(false)
  }

  useEffect(() => {
    const execute = async () => {
      await handleEdit()
    }

    execute()
  }, [title, content])

  if (!data)
    return (
      <View>
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
          <Text>{data?.title}</Text>
        ) : (
          <TextInput
            placeholderTextColor={'grey'}
            placeholder={data.title}
            style={{ backgroundColor: 'white', padding: 10, margin: 8, color: 'black' }}
            value={title}
            onChangeText={setTitle}
          />
        )}
        {!editOpen ? (
          <Markdown>{data?.content}</Markdown>
        ) : (
          <TextInput
            placeholderTextColor={'grey'}
            placeholder={data.content}
            style={{ backgroundColor: 'white', padding: 10, margin: 8, color: 'black' }}
            value={content}
            onChangeText={setContent}
          />
        )}
        <Pressable
          onPress={async () => {
            if (editOpen) {
              await handleEdit()
              setEditOpen(false)
              setEdited(true)
            } else {
              setEditOpen(true)
            }
          }}
          style={{ backgroundColor: `${editOpen ? 'green' : 'orangered'}`, padding: 20 }}
        >
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
            }}
          >
            {editOpen ? 'Save' : 'Edit'}
          </Text>
        </Pressable>
      </View>
    </>
  )
}
