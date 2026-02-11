import { View, Text } from 'react-native'
import React from 'react'
import ColorThemeSwitch from '../../components/ColorThemeSwitch'

export default function settings() {
  return (
    <View>
      <Text style={{ backgroundColor: 'red', color: 'white', padding: 100, margin: 100 }}>
        Settings
      </Text>
      <ColorThemeSwitch />
    </View>
  )
}
