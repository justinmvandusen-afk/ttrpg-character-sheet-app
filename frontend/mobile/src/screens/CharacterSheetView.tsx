import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { calculateModifier, calculateSkillBonus } from '../utils/sheetTemplates'

interface CharacterSheetViewProps {
  navigation: any
  route: any
}

export const CharacterSheetView: React.FC<CharacterSheetViewProps> = ({ navigation, route }) => {
  const sheet = route.params?.sheet
  const character = route.params?.character
  const [activeTab, setActiveTab] = useState<'abilities' | 'skills' | 'combat'>('abilities')

  const renderAbilitiesTab = () => {
    if (!sheet.abilities) return null

    return (
      <View style={styles.tabContent}>
        <View style={styles.abilitiesGrid}>
          {Object.entries(sheet.abilities).map(([key, ability]: [string, any]) => {
            const modifier = calculateModifier(ability.base || ability)
            return (
              <View key={key} style={styles.abilityBox}>
                <Text style={styles.abilityTitle}>{ability.name || key}</Text>
                <Text style={styles.abilityScore}>{ability.base || ability}</Text>
                <View style={styles.modifierBox}>
                  <Text style={styles.modifierText}>
                    {modifier >= 0 ? '+' : ''}{modifier}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  const renderSkillsTab = () => {
    if (!sheet.skills) return <Text>No skills data</Text>

    const proficiencyBonus = sheet.combat?.proficiencyBonus || 2

    return (
      <ScrollView style={styles.tabContent}>
        {Object.entries(sheet.skills).map(([key, skill]: [string, any]) => {
          const ability = sheet.abilities?.[skill.ability]
          const abilityMod = ability ? calculateModifier(ability.base || ability) : 0
          const skillBonus = calculateSkillBonus(abilityMod, skill.proficiency, proficiencyBonus)

          return (
            <View key={key} style={styles.skillItem}>
              <View style={styles.skillInfo}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillAbility}>{skill.ability}</Text>
              </View>
              <View style={styles.skillBonus}>
                <Text style={styles.skillBonusText}>
                  {skillBonus >= 0 ? '+' : ''}{skillBonus}
                </Text>
              </View>
              {skill.proficiency && (
                <MaterialCommunityIcons name="star" size={16} color="#0284c7" />
              )}
            </View>
          )
        })}
      </ScrollView>
    )
  }

  const renderCombatTab = () => {
    if (!sheet.combat) return null

    return (
      <View style={styles.tabContent}>
        <View style={styles.combatGrid}>
          <View style={styles.combatStat}>
            <Text style={styles.combatLabel}>AC</Text>
            <Text style={styles.combatValue}>{sheet.combat.armorClass || 10}</Text>
          </View>
          <View style={styles.combatStat}>
            <Text style={styles.combatLabel}>HP</Text>
            <Text style={styles.combatValue}>{sheet.combat.hitPoints || 8}</Text>
          </View>
          <View style={styles.combatStat}>
            <Text style={styles.combatLabel}>Prof</Text>
            <Text style={styles.combatValue}>+{sheet.combat.proficiencyBonus || 2}</Text>
          </View>
          <View style={styles.combatStat}>
            <Text style={styles.combatLabel}>Init</Text>
            <Text style={styles.combatValue}>{sheet.combat.initiative || 0}</Text>
          </View>
        </View>

        {sheet.combat.hitDice && (
          <View style={styles.combatDetail}>
            <Text style={styles.detailLabel}>Hit Dice</Text>
            <Text style={styles.detailValue}>{sheet.combat.hitDice}</Text>
          </View>
        )}

        {sheet.combat.speed && (
          <View style={styles.combatDetail}>
            <Text style={styles.detailLabel}>Speed</Text>
            <Text style={styles.detailValue}>{sheet.combat.speed} ft/round</Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.characterName}>{character?.name}</Text>
        <Text style={styles.characterLevel}>Level {character?.level || 1}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'abilities' && styles.activeTab]}
          onPress={() => setActiveTab('abilities')}
        >
          <MaterialCommunityIcons
            name="dumbbell"
            size={20}
            color={activeTab === 'abilities' ? '#0284c7' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'abilities' && styles.activeTabText]}>
            Abilities
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'skills' && styles.activeTab]}
          onPress={() => setActiveTab('skills')}
        >
          <MaterialCommunityIcons
            name="bookmark"
            size={20}
            color={activeTab === 'skills' ? '#0284c7' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'skills' && styles.activeTabText]}>
            Skills
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'combat' && styles.activeTab]}
          onPress={() => setActiveTab('combat')}
        >
          <MaterialCommunityIcons
            name="sword"
            size={20}
            color={activeTab === 'combat' ? '#0284c7' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'combat' && styles.activeTabText]}>
            Combat
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'abilities' && renderAbilitiesTab()}
        {activeTab === 'skills' && renderSkillsTab()}
        {activeTab === 'combat' && renderCombatTab()}
      </ScrollView>

      {/* Edit Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('CharacterSheetEditor', { character, sheet })}
      >
        <MaterialCommunityIcons name="pencil" size={20} color="white" />
        <Text style={styles.editButtonText}>Edit Sheet</Text>
      </TouchableOpacity>
    </View>
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
    paddingTop: 12,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  characterLevel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0284c7',
  },
  tabText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#0284c7',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  tabContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  abilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  abilityBox: {
    width: '48%',
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
  },
  abilityTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  abilityScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  modifierBox: {
    marginTop: 8,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modifierText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284c7',
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  skillAbility: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  skillBonus: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 12,
  },
  skillBonusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0284c7',
  },
  combatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  combatStat: {
    width: '48%',
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  combatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  combatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0284c7',
  },
  combatDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#0284c7',
    marginHorizontal: 12,
    marginVertical: 16,
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
})
