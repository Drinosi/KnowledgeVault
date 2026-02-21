import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { View, Text, Image, StyleSheet } from 'react-native'
import { useMemo } from 'react'
import CreateEntry from './CreateEntry'

type props = {
  darkMode: boolean
}

export default function EmptyStateHome({ darkMode }: props) {
  const styles = useMemo(() => createStyles(darkMode), [darkMode])
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.emptyStateWrapper}>
        <Image style={styles.homeImage} source={require('../assets/images/home_background.png')} />
        <View>
          <Text style={styles.noSnippetsText}>No Snippets Yet</Text>
          <Text style={styles.noSnippetsDescription}>Get started by adding a new snippet</Text>

          <CreateEntry />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const createStyles = (darkMode: boolean) =>
  StyleSheet.create({
    emptyStateWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      marginTop: 80,
    },
    homeImage: {
      width: '100%',
      height: 200,
    },
    noSnippetsText: {
      textAlign: 'center',
      fontSize: 20,
      marginBottom: 12,
      fontWeight: 600,
      color: darkMode ? '#a2a6b1' : '#1a1a1a',
    },
    noSnippetsDescription: {
      textAlign: 'center',
      fontSize: 16,
      color: darkMode ? '#a2a6b1' : 'grey',
      marginBottom: 30,
    },
    emptyAddSnippet: {
      paddingVertical: 10,
      marginBottom: 8,
      borderRadius: 10,
      backgroundColor: darkMode ? 'white' : '#4D88E9',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyAddSnippetText: {
      color: darkMode ? '#1a1a1a' : 'white',
      fontSize: 20,
      fontWeight: '600',
    },
  })
