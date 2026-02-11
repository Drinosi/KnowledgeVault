import { Tabs } from 'expo-router'
import { Entypo, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useColorScheme } from 'react-native'

import { useSelector } from 'react-redux'
import { RootState } from '../../store'

export default function TabLayout() {
  const systemScheme = useColorScheme()
  const themeMode = useSelector((state: RootState) => state.theme.mode)
  const darkMode = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark')

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4D88E9',
        tabBarStyle: {
          backgroundColor: darkMode ? '#1a1a1a' : 'white',
        },
        headerStyle: {
          backgroundColor: darkMode ? '#1a1a1a' : 'white',
          borderBottomColor: darkMode ? 'grey' : 'white',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: darkMode ? 'white' : 'black',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Entypo name="home" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome6 name="gear" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={26} color={color} />,
        }}
      />
    </Tabs>
  )
}
