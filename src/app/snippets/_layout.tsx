import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { useSearchParams } from 'expo-router/build/hooks'

export default function SnippetsLayout() {
  const systemScheme = useColorScheme()
  const themeMode = useSelector((state: RootState) => state.theme.mode)

  const darkMode = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark')

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
