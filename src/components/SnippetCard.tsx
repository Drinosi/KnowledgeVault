import { View, Text, Dimensions } from 'react-native'
import { Link } from 'expo-router'
import { Entry } from '../domain/Entry'

type SnippetCardProps = {
  item: Entry
}

const SnippetCard = ({ item }: SnippetCardProps) => {
  return (
    <Link
      style={{
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
      }}
      href={{
        pathname: '[snippet]/SnippetDetails',
        params: { snippet: item.id },
      }}
    >
      <View style={{ padding: 10, height: '100%', width: '100%' }}>
        <Text style={{ color: 'black', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
          {item.title}
        </Text>
        <Text style={{ color: 'black', fontSize: 14, marginBottom: 8 }}>{item.content}</Text>
        <Text style={{ color: 'black', fontSize: 14, marginBottom: 4 }}>
          Created on {new Date(Number(item.createdAt)).toDateString()}
        </Text>
        <Text style={{ color: 'black', fontSize: 14 }}>
          {item.updatedAt && `Last updated on ${new Date(Number(item.updatedAt)).toDateString()}`}
        </Text>
      </View>
    </Link>
  )
}

export default SnippetCard
