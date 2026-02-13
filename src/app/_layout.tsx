import { Stack } from 'expo-router'
import { store, persistor } from '../store/index'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

export default function RootLayout() {
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
