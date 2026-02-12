import { View, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { setThemeMode } from '../store/slices/colorThemeSlice'

import useIsDarkMode from '../hooks/useIsDarkMode'

const ColorThemeSwitch = () => {
  const { darkMode, themeMode } = useIsDarkMode()
  const dispatch: AppDispatch = useDispatch()

  const textColor = darkMode ? '#fff' : '#000'
  const backgroundColor = darkMode ? '#000' : '#fff'

  const styles = createStyles(darkMode)

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Picker
        selectedValue={themeMode}
        onValueChange={value => dispatch(setThemeMode(value))}
        dropdownIconColor={textColor}
        style={{ color: textColor }}
        itemStyle={{ color: textColor }}
        mode="dropdown"
      >
        <Picker.Item label="Light" value="light" />
        <Picker.Item label="Dark" value="dark" />
        <Picker.Item label="System" value="system" />
      </Picker>
    </View>
  )
}

const createStyles = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 16,
      borderRadius: 20,
      borderWidth: darkMode ? 1 : 0,
      borderColor: 'grey',
    },
  })

export default ColorThemeSwitch
