import { useColorScheme } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

function useIsDarkMode() {
  const systemScheme = useColorScheme()
  const themeMode = useSelector((state: RootState) => state.theme.mode)

  const darkMode = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark')

  return { darkMode, themeMode, systemScheme }
}

export default useIsDarkMode
