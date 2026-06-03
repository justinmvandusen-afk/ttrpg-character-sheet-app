import React, { useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { setGames, setLoading, setError } from '../store/gameSlice'
import apiClient from '../services/api'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface GamesScreenProps {
  navigation: any
}

export const GamesScreen: React.FC<GamesScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { games, loading, error } = useSelector((state: RootState) => state.game)

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    dispatch(setLoading(true))
    try {
      const response = await apiClient.getGames()
      dispatch(setGames(response.data))
    } catch (error: any) {
      dispatch(setError(error.message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const renderGameItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => navigation.navigate('GameDetail', { game: item })}
    >
      <View style={styles.gameHeader}>
        <MaterialCommunityIcons name="dice-d20" size={28} color="#0284c7" />
        <Text style={styles.gameName}>{item.name}</Text>
      </View>
      <Text style={styles.gameType}>{item.game_type.toUpperCase()}</Text>
      {item.description && (
        <Text style={styles.gameDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Games</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateGame')}>
          <MaterialCommunityIcons name="plus-circle" size={28} color="#0284c7" />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {games.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="inbox-multiple" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No games yet</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateGame')}
          >
            <Text style={styles.createButtonText}>Create your first game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={games}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadGames} />
          }
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  gameCard: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  gameType: {
    fontSize: 12,
    color: '#0284c7',
    fontWeight: '500',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: 12,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#c00',
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
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
  createButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 8,
  },
})
