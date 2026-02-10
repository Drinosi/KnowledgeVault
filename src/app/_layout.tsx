import { Stack } from 'expo-router'
import { store } from '../store/index'
import { Provider } from 'react-redux'

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, headerStyle: { backgroundColor: 'red' } }}
        />
      </Stack>
    </Provider>
  )
}
