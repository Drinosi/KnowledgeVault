import { Stack } from 'expo-router'

import useIsDarkMode from '../../hooks/useIsDarkMode'

export default function SnippetsLayout() {
  const { darkMode } = useIsDarkMode()

  return (
    <Stack
      screenOptions={{
        headerBackVisible: false,
        headerStyle: {
          backgroundColor: darkMode ? '#1a1a1a' : 'white',
        },
        headerTitleStyle: {
          color: darkMode ? 'white' : 'black',
        },
      }}
    />
  )
}
