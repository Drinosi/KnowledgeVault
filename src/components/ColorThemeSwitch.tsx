import { Text, Pressable } from 'react-native'
import { setThemeMode } from '../store/slices/colorThemeSlice'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'

const ColorThemeSwitch = () => {
  const themeMode = useSelector((state: RootState) => state.theme.mode)
  const dispatch = useDispatch()

  return (
    <>
      <Pressable style={{ padding: 12 }} onPress={() => dispatch(setThemeMode('light'))}>
        <Text>Light</Text>
      </Pressable>

      <Pressable style={{ padding: 12 }} onPress={() => dispatch(setThemeMode('dark'))}>
        <Text>Dark</Text>
      </Pressable>

      <Pressable style={{ padding: 12 }} onPress={() => dispatch(setThemeMode('system'))}>
        <Text>System</Text>
      </Pressable>
    </>
  )
}

export default ColorThemeSwitch
