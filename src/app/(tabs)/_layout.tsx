import { Tabs } from 'expo-router'
import { View, Text } from 'react-native'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
      <Tabs.Screen
        name="Me"
        options={{
          title: 'Me',
        }}
      />
    </Tabs>
  )
}
