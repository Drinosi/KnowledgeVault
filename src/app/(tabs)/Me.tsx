import { View, Text, Pressable } from 'react-native'
import { EntryRepository } from '../../repositories/EntryRepository'
import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { clearEntries } from '../../store/slices/entriesSlice'

import Feather from '@expo/vector-icons/Feather'

const Me = () => {
  const [loading, setLoading] = useState(false)

  const dispatch: AppDispatch = useDispatch()

  async function handleClick() {
    setLoading(true)
    try {
      await EntryRepository.deleteAll()

      dispatch(clearEntries())
    } catch (error: any) {
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Pressable
        style={{
          backgroundColor: '#dc3545',
          padding: 10,
          width: 200,
          borderRadius: 8,
          maxHeight: 60,
          flex: 1,
          justifyContent: 'space-between',
          alignContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
        onPress={handleClick}
      >
        <Feather name="trash-2" size={24} color={'white'} />
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          {!loading ? 'Delete all my snippets!' : 'Loading...'}
        </Text>
      </Pressable>
    </View>
  )
}

export default Me
