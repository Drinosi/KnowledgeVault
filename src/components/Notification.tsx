import { View, Text, StyleSheet } from 'react-native'

import { useSelector } from 'react-redux'

import { RootState } from '../store'
import { useMemo } from 'react'
import useIsDarkMode from '../hooks/useIsDarkMode'

export default function Notification() {
  const { darkMode } = useIsDarkMode()
  const { type, message } = useSelector((state: RootState) => state.notification)

  const notificationStyle = {
    backgroundColor: 'white',
  }
  let color = 'white'

  switch (type) {
    case 'error':
      notificationStyle.backgroundColor = 'red'
      color = 'white'
      break
    case 'success':
      notificationStyle.backgroundColor = 'green'
      color = 'white'
      break
    case 'default':
      notificationStyle.backgroundColor = darkMode ? 'black' : 'white'
      color = darkMode ? 'white' : 'black'
      break
  }

  return (
    <View style={[styles.wrapper, notificationStyle]}>
      <Text style={[{ color }, styles.text]}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 100,
    zIndex: 9999,
    padding: 20,
    justifyContent: 'center',
    borderRadius: 5,
  },
  text: {
    fontSize: 17,
  },
})
