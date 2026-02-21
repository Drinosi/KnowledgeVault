import 'react-native-get-random-values'

import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

import { v4 as uuidv4 } from 'uuid'

import { Entry } from '../domain/Entry'
import { router } from 'expo-router'

import { EntryRepository } from '../repositories/EntryRepository'
import { AppDispatch } from '../store'
import { useDispatch } from 'react-redux'

import { addEntry } from '../store/slices/entriesSlice'

export default function CreateEntry() {
  const dispatch: AppDispatch = useDispatch()
  const handleCreate = async () => {
    const now = Date.now()

    const newEntry: Entry = {
      id: uuidv4(),
      title: '',
      content: '',
      language: '',
      createdAt: now,
      updatedAt: null,
    }

    await EntryRepository.create(newEntry)

    dispatch(addEntry(newEntry))

    router.push(`/snippets/${newEntry.id}`)
  }

  return (
    <TouchableOpacity onPress={handleCreate}>
      <Ionicons name="add" size={28} color={'white'} />
    </TouchableOpacity>
  )
}
