import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { store, persistor } from '../store/index'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { runMigrations } from '../db/migrations'
import { View, Text, ActivityIndicator } from 'react-native'

export default function RootLayout() {
  const [migrationsDone, setMigrationsDone] = useState(false)

  useEffect(() => {
    async function initDB() {
      try {
        await runMigrations()
        setMigrationsDone(true)
      } catch (err) {
        console.error('Migration failed', err)
      }
    }
    initDB()
  }, [])

  if (!migrationsDone) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Setting up database...</Text>
      </View>
    )
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="snippets" options={{ headerShown: false }} />
        </Stack>
      </PersistGate>
    </Provider>
  )
}
