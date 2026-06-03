import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { addCharacter } from '../store/characterSlice'
import apiClient from '../services/api'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface CreateCharacterScreenProps {
  navigation: any
  route: any
}

export const CreateCharacterScreen: React.FC<CreateCharacterScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>()
  const game = route.params?.game
  
  const [characterName, setCharacterName] = useState('')
  const [level, setLevel] = useState('1')
  const [description, setDescription] = useState('')
  const [selectedGameType, setSelectedGameType] = useState(game?.game_type || 'dnd5e')
  const [loading, setLoading] = useState(false)

  const gameTypes = [
    { id: 'dnd5e', name: 'D&D 5e', icon: 'dice-d20' },
    { id: 'pathfinder', name: 'Pathfinder', icon: 'sword' },
    { id: 'vampire', name: 'Vampire', icon: 'moon-waning-crescent' },
    { id: 'wod', name: 'WoD', icon: 'ghost' },
  ]

  const handleCreate = async () => {
    if (!characterName.trim()) {
      Alert.alert('Error', 'Please enter a character name')
      return
    }

    setLoading(true)
    try {
      const levelNum = parseInt(level) || 1
      const newCharacter = await apiClient.createCharacter(
        game.id,
        characterName,
        levelNum,
        description
      )

      dispatch(addCharacter(newCharacter))

      Alert.alert('Success', 'Character created! Now create their sheet.')
      
      // Navigate to sheet editor
      navigation.replace('CharacterSheetEditor', {
        character: newCharacter,
        gameType: selectedGameType,
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to create character')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Character</Text>
        <Text style={styles.subtitle}>{game?.name}</Text>
      </View>

      {/* Character Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Character Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter character name"
          value={characterName}
          onChangeText={setCharacterName}
          placeholderTextColor="#999"
        />
      </View>

      {/* Level */}
      <View style={styles.section}>
        <Text style={styles.label}>Starting Level</Text>
        <View style={styles.levelSelector}>
          {[1, 2, 3, 5, 10, 15, 20].map((lvl) => (
            <TouchableOpacity
              key={lvl}
              style={[
                styles.levelButton,
                level === lvl.toString() && styles.levelButtonActive,
              ]}
              onPress={() => setLevel(lvl.toString())}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  level === lvl.toString() && styles.levelButtonTextActive,
                ]}
              >
                {lvl}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Game System */}
      <View style={styles.section}>
        <Text style={styles.label}>Game System</Text>
        <View style={styles.gameTypeGrid}>
          {gameTypes.map((gtype) => (
            <TouchableOpacity
              key={gtype.id}
              style={[
                styles.gameTypeCard,
                selectedGameType === gtype.id && styles.gameTypeCardActive,
              ]}
              onPress={() => setSelectedGameType(gtype.id)}
            >
              <MaterialCommunityIcons
                name={gtype.icon as any}
                size={24}
                color={selectedGameType === gtype.id ? '#0284c7' : '#999'}
              />
              <Text
                style={[
                  styles.gameTypeName,
                  selectedGameType === gtype.id && styles.gameTypeNameActive,
                ]}
              >
                {gtype.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Character background and notes"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />
      </View>

      {/* Create Button */}
      <TouchableOpacity
        style={[styles.createButton, loading && styles.createButtonDisabled]}
        onPress={handleCreate}
        disabled={loading}
      >
        <MaterialCommunityIcons name="plus" size={20} color="white" />
        <Text style={styles.createButtonText}>
          {loading ? 'Creating...' : 'Create Character'}
        </Text>
      </TouchableOpacity>

      <View style={styles.spacing} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0284c7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  levelSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  levelButtonActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  levelButtonTextActive: {
    color: 'white',
  },
  gameTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameTypeCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  gameTypeCardActive: {
    backgroundColor: '#f0f7ff',
    borderColor: '#0284c7',
  },
  gameTypeName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginTop: 8,
  },
  gameTypeNameActive: {
    color: '#0284c7',
  },
  createButton: {
    backgroundColor: '#0284c7',
    marginHorizontal: 12,
    marginVertical: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  spacing: {
    height: 40,
  },
})
