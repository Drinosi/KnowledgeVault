import { Tabs } from 'expo-router'
import { Entypo, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useColorScheme } from 'react-native'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const darkMode = colorScheme === 'dark'
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
