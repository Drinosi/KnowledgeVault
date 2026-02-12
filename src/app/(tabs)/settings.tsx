import { View, StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import ColorThemeSwitch from '../../components/ColorThemeSwitch'

import useIsDarkMode from '../../hooks/useIsDarkMode'

export default function settings() {
  const { darkMode } = useIsDarkMode()

  const styles = useMemo(() => createStyles(darkMode), [darkMode])
  return (
    <View style={styles.container}>
      <ColorThemeSwitch />
    </View>
  )
}

const createStyles = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      backgroundColor: darkMode ? 'black' : 'white',
    },
  })
