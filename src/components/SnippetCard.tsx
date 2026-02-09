import { View, Text, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { Entry } from '../domain/Entry'

type SnippetCardProps = {
  item: Entry
}

const SnippetCard = ({ item }: SnippetCardProps) => {
  let snippetTypeColor

  switch (item.type) {
    case 'snippet':
      snippetTypeColor = '#618ae2'
      break
    case 'link':
      snippetTypeColor = '#9866D3'
      break
    case 'concept':
      snippetTypeColor = '#e3aa49'
      break
    default:
      snippetTypeColor = '#E8F1FF'
  }

  return (
    <Link
      style={styles.card}
      href={{
        pathname: '[snippet]/SnippetDetails',
        params: { snippet: item.id },
      }}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>

        <Text style={[styles.typeBadge, { backgroundColor: snippetTypeColor }]}>{item.type}</Text>

        <Text style={styles.description}>{item.content}</Text>

        <Text style={styles.date}>
          Created on {new Date(Number(item.createdAt)).toDateString()}
        </Text>

        <Text style={styles.date}>
          {item.updatedAt && `Last updated on ${new Date(Number(item.updatedAt)).toDateString()}`}
        </Text>
      </View>
    </Link>
  )
}

export default SnippetCard

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    maxHeight: 200,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,

    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 12,
  },

  content: {
    padding: 10,
    width: '100%',
  },

  title: {
    color: 'black',
    fontSize: 30,
    marginBottom: 12,
  },

  typeBadge: {
    color: 'white',
    fontSize: 12,
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },

  description: {
    color: '#777C8E',
    fontSize: 14,
    marginBottom: 8,
  },

  date: {
    color: '#C2C7D4',
    fontSize: 14,
    marginBottom: 4,
  },
})
