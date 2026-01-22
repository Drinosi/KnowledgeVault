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

  if (!data)
    return (
      <View>
        <Text>There was a problem showing this Entry</Text>
      </View>
    )

  return (
    <>
      <Stack.Screen options={{ title: data?.title ?? 'Loading...' }} />
      <View style={{ padding: 6 }}>
        <Text>{data?.title}</Text>
      </View>
    </>
  )
}
