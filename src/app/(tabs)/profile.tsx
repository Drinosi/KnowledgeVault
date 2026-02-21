import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useState } from 'react'

import { EntryRepository } from '../../repositories/EntryRepository'

import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { clearEntries } from '../../store/slices/entriesSlice'

import Feather from '@expo/vector-icons/Feather'

const Profile = () => {
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
    <View style={styles.wrapper}>
      <Pressable style={styles.deleteButton} onPress={handleClick}>
        <Feather name="trash-2" size={24} color={'white'} />
        <Text style={styles.buttonText}>{!loading ? 'Delete all my snippets!' : 'Loading...'}</Text>
      </Pressable>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
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
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    justifyContent: 'center',
    alignContent: 'center',
  },
})
