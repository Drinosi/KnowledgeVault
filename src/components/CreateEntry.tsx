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
    <View style={{ flex: 1 }}>
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholderTextColor="black"
            />
            <TextInput
              placeholder="Content"
              placeholderTextColor="black"
              value={content}
              onChangeText={setContent}
              style={styles.input}
              multiline
            />

            <View style={styles.pickerWrapper}>
              <Picker
                itemStyle={{ fontSize: 18, textAlign: 'center', color: 'black' }}
                style={{
                  width: '100%',
                  // backgroundColor: 'red',
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
              placeholder="Language (optional)"
              placeholderTextColor="black"
              value={language}
              onChangeText={setLanguage}
              style={styles.input}
            />

            <TextInput
              placeholder="Source URL (optional)"
              placeholderTextColor="black"
              value={sourceUrl}
              onChangeText={setSourceUrl}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 10,
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
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,

    marginBottom: 12,
    overflow: 'hidden',
    height: 120,
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    padding: 12,
    backgroundColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  cancelButton: {
    padding: 12,
    backgroundColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: '600',
  },
})
