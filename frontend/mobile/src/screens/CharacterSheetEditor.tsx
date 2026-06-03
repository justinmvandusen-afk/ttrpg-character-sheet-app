import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/store'
import apiClient from '../services/api'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { calculateModifier } from '../utils/sheetTemplates'

interface CharacterSheetEditorProps {
  navigation: any
  route: any
}

export const CharacterSheetEditor: React.FC<CharacterSheetEditorProps> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>()
  const character = route.params?.character
  const gameType = route.params?.gameType || 'dnd5e'
  
  const [sheetData, setSheetData] = useState<any>({
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skills: {},
    combat: {
      armorClass: 10,
      hitPoints: 8,
      proficiencyBonus: 2,
    },
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSheetData()
  }, [])

  const loadSheetData = async () => {
    try {
      const template = await apiClient.getSheetTemplate(gameType)
      if (template) {
        setSheetData(template)
      }
    } catch (error) {
      console.error('Error loading template:', error)
    }
  }

  const handleAbilityChange = (ability: string, value: string) => {
    const numValue = parseInt(value) || 0
    setSheetData({
      ...sheetData,
      abilities: {
        ...sheetData.abilities,
        [ability]: numValue,
      },
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await apiClient.createSheet(character.id, gameType, sheetData)
      Alert.alert('Success', 'Character sheet saved!')
      navigation.goBack()
    } catch (error) {
      Alert.alert('Error', 'Failed to save character sheet')
    } finally {
      setSaving(false)
    }
  }

  const abilityNames = {
    strength: 'STR',
    dexterity: 'DEX',
    constitution: 'CON',
    intelligence: 'INT',
    wisdom: 'WIS',
    charisma: 'CHA',
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Character Sheet: {character.name}</Text>
        <Text style={styles.subtitle}>{gameType.toUpperCase()}</Text>
      </View>

      {/* Abilities Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abilities</Text>
        <View style={styles.abilitiesGrid}>
          {Object.entries(sheetData.abilities).map(([key, value]: [string, any]) => (
            <View key={key} style={styles.abilityCard}>
              <Text style={styles.abilityName}>{abilityNames[key as keyof typeof abilityNames]}</Text>
              <TextInput
                style={styles.abilityInput}
                value={value.toString()}
                onChangeText={(text) => handleAbilityChange(key, text)}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={styles.abilityModifier}>
                {calculateModifier(value) >= 0 ? '+' : ''}{calculateModifier(value)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Combat Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Combat Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Armor Class</Text>
          <TextInput
            style={styles.statInput}
            value={sheetData.combat.armorClass.toString()}
            onChangeText={(text) =>
              setSheetData({
                ...sheetData,
                combat: { ...sheetData.combat, armorClass: parseInt(text) || 0 },
              })
            }
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Hit Points</Text>
          <TextInput
            style={styles.statInput}
            value={sheetData.combat.hitPoints.toString()}
            onChangeText={(text) =>
              setSheetData({
                ...sheetData,
                combat: { ...sheetData.combat, hitPoints: parseInt(text) || 0 },
              })
            }
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Proficiency Bonus</Text>
          <TextInput
            style={styles.statInput}
            value={sheetData.combat.proficiencyBonus.toString()}
            onChangeText={(text) =>
              setSheetData({
                ...sheetData,
                combat: { ...sheetData.combat, proficiencyBonus: parseInt(text) || 0 },
              })
            }
            keyboardType="number-pad"
          />
        </View>
      </View>

      {/* Skills Section for D&D 5e */}
      {gameType === 'dnd5e' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills (D&D 5e)</Text>
          <Text style={styles.skillsInfo}>Skills are calculated based on abilities</Text>
          <View style={styles.skillsList}>
            {Object.entries(sheetData.skills || {}).slice(0, 6).map(([key, skill]: [string, any]) => (
              <View key={key} style={styles.skillRow}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <TouchableOpacity style={styles.proficiencyToggle}>
                  <MaterialCommunityIcons
                    name={skill.proficiency ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                    size={20}
                    color={skill.proficiency ? '#0284c7' : '#999'}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <MaterialCommunityIcons name="content-save" size={20} color="white" />
        <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Sheet'}</Text>
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
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  abilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  abilityCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
    alignItems: 'center',
  },
  abilityName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  abilityInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  abilityModifier: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284c7',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  statInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    width: 100,
    fontSize: 16,
    textAlign: 'center',
  },
  skillsInfo: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  skillsList: {
    gap: 12,
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  skillName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  proficiencyToggle: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#0284c7',
    marginHorizontal: 12,
    marginVertical: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  spacing: {
    height: 40,
  },
})
