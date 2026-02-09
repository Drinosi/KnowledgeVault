import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Modal, Image } from 'react-native'
import 'react-native-get-random-values'

import { Picker } from '@react-native-picker/picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

type props = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  onSubmit: (entry: {
    title: string
    content: string
    type: 'snippet' | 'concept' | 'link'
    language?: string
    sourceUrl?: string
  }) => void
}

export default function CreateSnippetModal({ visible, setVisible, onSubmit }: props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<'snippet' | 'concept' | 'link'>('snippet')
  const [language, setLanguage] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')

  const handleSubmit = () => {
    if (!title || !content || !type) return

    onSubmit({ title, content, type, language, sourceUrl })

    setTitle('')
    setContent('')
    setType('snippet')
    setLanguage('')
    setSourceUrl('')
  }

  return (
    <View>
      <Modal visible={visible} animationType="slide" transparent={false}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.headerRow}>
                <Image
                  style={styles.headerImage}
                  source={require('../assets/images/home_background.png')}
                />
                <Text style={styles.headerText}>Add new snippet</Text>
              </View>

              <Text style={styles.label}>Title</Text>
              <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                placeholderTextColor="lightgrey"
              />

              <Text style={styles.label}>Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  itemStyle={styles.pickerItem}
                  style={styles.picker}
                  selectedValue={type}
                  onValueChange={value => setType(value)}
                >
                  <Picker.Item label="Snippet" value="snippet" />
                  <Picker.Item label="Concept" value="concept" />
                  <Picker.Item label="Link" value="link" />
                </Picker>
              </View>

              <Text style={styles.label}>Description</Text>
              <TextInput
                placeholder="Enter a description"
                placeholderTextColor="lightgrey"
                value={content}
                onChangeText={setContent}
                style={styles.descriptionInput}
                multiline
              />

              {type === 'link' && (
                <TextInput
                  placeholder="Source URL (optional)"
                  placeholderTextColor="lightgrey"
                  value={sourceUrl}
                  onChangeText={setSourceUrl}
                  style={styles.urlInput}
                />
              )}

              <View style={styles.buttonRow}>
                <Pressable style={styles.cancelButton} onPress={() => setVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Create Snippet</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },

  headerRow: {
    height: 120,
    marginLeft: -30,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerImage: {
    width: 140,
    height: 140,
  },

  headerText: {
    fontSize: 20,
    alignSelf: 'baseline',
    borderBottomWidth: 1,
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 20,
    borderBottomColor: '#c7c9d0',
  },

  label: {
    color: '#c7c9d0',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 16,
  },

  input: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#c7c9d0',
    height: 45,
    fontSize: 16,
    borderRadius: 8,
    color: '#8b8c91',
    marginBottom: 12,
    backgroundColor: 'white',
  },

  descriptionInput: {
    minHeight: 150,
    backgroundColor: 'white',
    padding: 6,
    fontSize: 16,
    borderRadius: 8,
    color: '#8b8c91',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c7c9d0',
  },

  urlInput: {
    backgroundColor: 'white',
    padding: 6,
    fontSize: 16,
    height: 45,
    color: '#8b8c91',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c7c9d0',
    marginBottom: 12,
  },

  pickerWrapper: {
    borderRadius: 8,
    maxHeight: 150,
    minHeight: 150,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#c7c9d0',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  picker: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },

  pickerItem: {
    fontSize: 18,
    textAlign: 'center',
    color: '#8b8c91',
  },

  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#558ee7',
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
  },

  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    width: 130,
    borderColor: 'grey',
    borderRadius: 20,
    alignItems: 'center',
  },

  cancelButtonText: {
    color: 'grey',
    fontSize: 18,
  },
})
