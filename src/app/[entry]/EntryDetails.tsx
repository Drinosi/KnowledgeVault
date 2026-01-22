import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { EntryRepository } from '../../repositories/EntryRepository'
import { Entry } from '../../domain/Entry'

export default function EntryDetails() {
  const [data, setData] = useState<Entry>()
  const params = useLocalSearchParams()

  useEffect(() => {
    ;(async () => {
      const response = await EntryRepository.getById(params.entry as string)
      if (response) setData(response)
    })()
  }, [])

  return (
    <>
      <Stack.Screen options={{ title: data?.title ?? 'Loading...' }} />
      <View style={{ padding: 6 }}>
        <Text>{data?.title}</Text>
      </View>
    </>
  )
}
