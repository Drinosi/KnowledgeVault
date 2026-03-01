import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { store, persistor, AppDispatch } from '../store/index'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { runMigrations } from '../db/migrations'
import { View, ActivityIndicator, Text } from 'react-native'
import { useDispatch } from 'react-redux'
import Notification from '../components/Notification'
import { setNotification, clearNotification } from '../store/slices/notificationSlice'

import { useSelector } from 'react-redux'

import { RootState } from '../store/index'

function RootLayout() {
  const [migrationsDone, setMigrationsDone] = useState(false)
  const dispatch: AppDispatch = useDispatch()

  const { type, message } = useSelector((state: RootState) => state.notification)

  function clearNotif() {
    dispatch(clearNotification())
  }

  useEffect(() => {
    if (type && message) {
      const timer = setTimeout(() => {
        clearNotif()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [type, message])

  useEffect(() => {
    async function initDB() {
      try {
        await runMigrations()
        dispatch(setNotification({ type: 'success', message: 'Database setup successfully' }))
        setTimeout(() => {
          clearNotif()
        }, 3000)
      } catch (err) {
        dispatch(
          setNotification({ type: 'error', message: 'There was an issue setting up database' }),
        )
        setTimeout(() => {
          clearNotif()
        }, 3000)
      } finally {
        setMigrationsDone(true)
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
    <View style={{ position: 'relative', flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="snippets" options={{ headerShown: false }} />
      </Stack>
      {type && message && <Notification />}
    </View>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootLayout />
      </PersistGate>
    </Provider>
  )
}
