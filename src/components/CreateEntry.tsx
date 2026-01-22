import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Modal } from 'react-native'
import 'react-native-get-random-values'

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
            />
            <TextInput
              placeholder="Content"
              value={content}
              onChangeText={setContent}
              style={styles.input}
              multiline
            />
            <TextInput
              placeholder="Type (snippet | concept | link)"
              value={type}
              onChangeText={text => setType(text as 'snippet' | 'concept' | 'link')}
              style={styles.input}
            />
            <TextInput
              placeholder="Language (optional)"
              value={language}
              onChangeText={setLanguage}
              style={styles.input}
            />
            <TextInput
              placeholder="Source URL (optional)"
              value={sourceUrl}
              onChangeText={setSourceUrl}
              style={styles.input}
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
