import { Tabs } from 'expo-router'
import { Entypo, FontAwesome6, Ionicons } from '@expo/vector-icons'

import { View, Pressable } from 'react-native'

import useIsDarkMode from '../../hooks/useIsDarkMode'
import CreateEntry from '../../components/CreateEntry'

import { toggleSidebar } from '../../store/slices/sideBarSlice'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../store'

export default function TabLayout() {
  const { darkMode } = useIsDarkMode()
  const dispatch = useDispatch()
  const open = useSelector((state: RootState) => state.sidebar.opened)

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
          tabBarIcon: ({ color }) => <Entypo name="home" size={26} color={color} />,
          header: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#1a1a1a',
                paddingTop: 60,
                paddingHorizontal: 16,
                paddingBottom: 20,
              }}
            >
              <Pressable onPress={() => dispatch(toggleSidebar())}>
                <Ionicons name={open ? 'close' : 'reorder-three'} size={40} color="white" />
              </Pressable>
              <CreateEntry />
            </View>
          ),
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
