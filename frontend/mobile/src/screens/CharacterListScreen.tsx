import React, { useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { setCharacters, setLoading } from '../store/characterSlice'
import apiClient from '../services/api'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface CharacterListScreenProps {
  navigation: any
  route: any
}

export const CharacterListScreen: React.FC<CharacterListScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { characters, loading } = useSelector((state: RootState) => state.character)
  const game = route.params?.game

  useEffect(() => {
    loadCharacters()
  }, [])

  const loadCharacters = async () => {
    dispatch(setLoading(true))
    try {
      const response = await apiClient.getCharacters()
      // Filter characters for this game
      const gameCharacters = response.data.filter((c: any) => c.game_id === game.id)
      dispatch(setCharacters(gameCharacters))
    } catch (error) {
      console.error('Error loading characters:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  const renderCharacterItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.characterCard}
      onPress={() => navigation.navigate('CharacterDetail', { character: item })}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.characterName}>{item.name}</Text>
          <Text style={styles.characterLevel}>Level {item.level}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
      </View>
      {item.description && (
        <Text style={styles.characterDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.gameTitle}>{game?.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateCharacter', { game })}>
          <MaterialCommunityIcons name="plus-circle" size={28} color="#0284c7" />
        </TouchableOpacity>
      </View>

      {characters.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-multiple" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No characters in this game</Text>
        </View>
      ) : (
        <FlatList
          data={characters}
          renderItem={renderCharacterItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  characterCard: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  characterLevel: {
    fontSize: 14,
    color: '#0284c7',
    marginTop: 4,
  },
  characterDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 12,
  },
  listContent: {
    paddingVertical: 8,
  },
})
