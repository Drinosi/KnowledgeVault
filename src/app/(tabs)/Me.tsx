import { View, Text, Pressable } from 'react-native'
import { EntryRepository } from '../../repositories/EntryRepository'
import { useState } from 'react'

const Me = () => {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      await EntryRepository.deleteAll()
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
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleClick}
      >
        <Text style={{ textAlign: 'center', color: 'white' }}>
          {!loading ? 'Delete all my snippets!' : 'Loading...'}
        </Text>
      </Pressable>
    </View>
  )
}

export default Me
