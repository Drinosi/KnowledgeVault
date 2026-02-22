import { Modal, View, Text, Pressable, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { removeEntry, updateEntry } from '../store/slices/entriesSlice'
import { EntryRepository } from '../repositories/EntryRepository'
import { useDispatch } from 'react-redux'
import { Entry } from '../domain/Entry'
import { MaterialIcons } from '@expo/vector-icons'
import { useMemo } from 'react'

type props = {
  modalOpen: boolean
  setModalOpen: (modalOpen: boolean) => void
  item: Entry
  darkMode: boolean
}

export default function SnippetActions({ modalOpen, setModalOpen, item, darkMode }: props) {
  const dispatch = useDispatch()

  const styles = useMemo(() => createStyles(darkMode), [darkMode])
  return (
    <Modal
      visible={modalOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setModalOpen(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.actions}>
            <View style={styles.actionWrapper}>
              <Pressable
                onPress={async () => {
                  await EntryRepository.update(item.id, { locked: 1 })
                  dispatch(
                    updateEntry({
                      ...item,
                      locked: 1,
                      updatedAt: Date.now(),
                    }),
                  )
                  setModalOpen(false)
                }}
                style={styles.iconButton}
              >
                <MaterialIcons name="lock" size={22} color="black" />
              </Pressable>
              <Text style={styles.actionText}>Lock</Text>
            </View>
            <View style={styles.actionWrapper}>
              <Pressable onPress={() => setModalOpen(false)} style={styles.iconButton}>
                <FontAwesome name="thumb-tack" size={22} color="black" />
              </Pressable>
              <Text style={styles.actionText}>Pin</Text>
            </View>
            <View style={styles.actionWrapper}>
              <Pressable
                onPress={async () => {
                  await EntryRepository.delete(item.id)
                  dispatch(removeEntry(item.id))
                  setModalOpen(false)
                }}
                style={styles.iconButton}
              >
                <MaterialIcons name="delete" size={22} color="black" />
              </Pressable>
              <Text style={styles.actionText}>Delete</Text>
            </View>
          </View>

          <Pressable onPress={() => setModalOpen(false)} style={styles.closeButton}>
            <Text>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const createStyles = darkMode =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: darkMode ? '#1a1a1a' : '#f3f3f7',
      padding: 20,
      borderRadius: 10,
      width: '70%',
    },
    modalTitle: {
      fontWeight: 'bold',
      marginBottom: 10,
    },
    button: {
      marginTop: 20,
      color: 'blue',
    },
    actions: {
      justifyContent: 'center',
      gap: 20,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#676c7c' : 'lightgrey',
      paddingBottom: 20,
    },
    iconButton: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeButton: {
      backgroundColor: 'white',
      padding: 15,
      alignItems: 'center',
      borderRadius: 40,
      marginTop: 20,
    },
    actionText: {
      color: darkMode ? '#a2a6b1' : 'black',
    },
    actionWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
  })
