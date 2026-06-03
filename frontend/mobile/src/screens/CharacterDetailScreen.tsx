import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/store'
import { updateCharacter } from '../store/characterSlice'
import apiClient from '../services/api'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface CharacterDetailScreenProps {
  navigation: any
  route: any
}

export const CharacterDetailScreen: React.FC<CharacterDetailScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>()
  const character = route.params?.character
  const [sheet, setSheet] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCharacterSheet()
  }, [])

  const loadCharacterSheet = async () => {
    try {
      // Fetch character sheet data
      setLoading(false)
    } catch (error) {
      console.error('Error loading character sheet:', error)
      setLoading(false)
    }
  }

  const handleLevelUp = async () => {
    try {
      const updated = {
        ...character,
        level: character.level + 1,
      }
      await apiClient.updateCharacter(character.id, updated)
      dispatch(updateCharacter(updated))
      Alert.alert('Success', 'Character leveled up!')
    } catch (error) {
      Alert.alert('Error', 'Failed to level up character')
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.characterName}>{character.name}</Text>
          <Text style={styles.characterLevel}>Level {character.level}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('EditCharacter', { character })}>
          <MaterialCommunityIcons name="pencil" size={24} color="#0284c7" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Experience</Text>
          <Text style={styles.statValue}>{character.experience}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Created</Text>
          <Text style={styles.statValue}>{new Date(character.created_at).toLocaleDateString()}</Text>
        </View>
      </View>

      {character.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionContent}>{character.description}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.actionButton} onPress={handleLevelUp}>
        <MaterialCommunityIcons name="trending-up" size={20} color="white" />
        <Text style={styles.actionButtonText}>Level Up</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  characterLevel: {
    fontSize: 16,
    color: '#0284c7',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 6,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#0284c7',
    marginHorizontal: 12,
    marginVertical: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
})
