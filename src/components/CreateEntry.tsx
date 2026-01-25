import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native'
import 'react-native-get-random-values'

import { Picker } from '@react-native-picker/picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

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

export default function CreateEntryModal({ visible, setVisible, onSubmit }: props) {
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
      <Modal
        style={{ backgroundColor: 'black' }}
        visible={visible}
        animationType="slide"
        transparent={false}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 28, marginBottom: 20 }}>What do you have in mind?</Text>
              <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                placeholderTextColor="lightgrey"
              />
              <View style={styles.pickerWrapper}>
                <Picker
                  itemStyle={{ fontSize: 18, textAlign: 'center', color: 'black' }}
                  style={{
                    width: '100%',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  selectedValue={type}
                  onValueChange={value => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                    setType(value)
                  }}
                >
                  <Picker.Item label="Snippet" value="snippet" />
                  <Picker.Item label="Concept" value="concept" />
                  <Picker.Item label="Link" value="link" />
                </Picker>
              </View>
              <TextInput
                placeholder="Code, text, snippets... anything really"
                placeholderTextColor="lightgrey"
                value={content}
                onChangeText={setContent}
                style={{
                  minHeight: 150,
                  backgroundColor: 'white',
                  padding: 10,
                  fontSize: 16,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
                multiline
              />

              <TextInput
                placeholder="Source URL (optional)"
                placeholderTextColor="lightgrey"
                value={sourceUrl}
                onChangeText={setSourceUrl}
                style={{
                  backgroundColor: 'white',
                  padding: 10,
                  fontSize: 18,
                  height: 60,
                  borderRadius: 8,
                  marginBottom: 12,
                  display: `${type === 'link' ? 'flex' : 'none'}`,
                }}
              />

              <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Create Entry</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={() => setVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  openButton: {
    marginTop: 50,
    padding: 12,
    backgroundColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
  },
  openButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  pickerWrapper: {
    borderRadius: 8,
    maxHeight: 150,
    minHeight: 150,
    marginBottom: 12,
    overflow: 'hidden',
    color: 'black',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
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
    height: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 20,
  },
  input: {
    padding: 10,
    height: 60,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    padding: 16,
    backgroundColor: 'indigo',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  cancelButton: {
    padding: 16,
    backgroundColor: 'black',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
  },
})
