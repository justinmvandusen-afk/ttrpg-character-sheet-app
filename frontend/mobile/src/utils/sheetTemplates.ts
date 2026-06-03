// D&D 5e Templates
export const DND5E_TEMPLATE = {
  id: 'dnd5e',
  name: 'D&D 5e Character Sheet',
  gameType: 'dnd5e',
  abilities: {
    strength: { name: 'Strength', base: 10, modifier: 0 },
    dexterity: { name: 'Dexterity', base: 10, modifier: 0 },
    constitution: { name: 'Constitution', base: 10, modifier: 0 },
    intelligence: { name: 'Intelligence', base: 10, modifier: 0 },
    wisdom: { name: 'Wisdom', base: 10, modifier: 0 },
    charisma: { name: 'Charisma', base: 10, modifier: 0 },
  },
  skills: {
    acrobatics: { name: 'Acrobatics', ability: 'dexterity', proficiency: false },
    animal_handling: { name: 'Animal Handling', ability: 'wisdom', proficiency: false },
    arcana: { name: 'Arcana', ability: 'intelligence', proficiency: false },
    athletics: { name: 'Athletics', ability: 'strength', proficiency: false },
    deception: { name: 'Deception', ability: 'charisma', proficiency: false },
    history: { name: 'History', ability: 'intelligence', proficiency: false },
    insight: { name: 'Insight', ability: 'wisdom', proficiency: false },
    intimidation: { name: 'Intimidation', ability: 'charisma', proficiency: false },
    investigation: { name: 'Investigation', ability: 'intelligence', proficiency: false },
    medicine: { name: 'Medicine', ability: 'wisdom', proficiency: false },
    nature: { name: 'Nature', ability: 'intelligence', proficiency: false },
    perception: { name: 'Perception', ability: 'wisdom', proficiency: false },
    performance: { name: 'Performance', ability: 'charisma', proficiency: false },
    persuasion: { name: 'Persuasion', ability: 'charisma', proficiency: false },
    religion: { name: 'Religion', ability: 'intelligence', proficiency: false },
    sleight_of_hand: { name: 'Sleight of Hand', ability: 'dexterity', proficiency: false },
    stealth: { name: 'Stealth', ability: 'dexterity', proficiency: false },
    survival: { name: 'Survival', ability: 'wisdom', proficiency: false },
  },
  combat: {
    armorClass: 10,
    hitPoints: 8,
    hitDice: '1d8',
    speed: 30,
    initiative: 0,
    proficiencyBonus: 2,
  },
}

// Pathfinder Template
export const PATHFINDER_TEMPLATE = {
  id: 'pathfinder',
  name: 'Pathfinder Character Sheet',
  gameType: 'pathfinder',
  abilities: {
    strength: { name: 'Strength', base: 10, modifier: 0 },
    dexterity: { name: 'Dexterity', base: 10, modifier: 0 },
    constitution: { name: 'Constitution', base: 10, modifier: 0 },
    intelligence: { name: 'Intelligence', base: 10, modifier: 0 },
    wisdom: { name: 'Wisdom', base: 10, modifier: 0 },
    charisma: { name: 'Charisma', base: 10, modifier: 0 },
  },
  skills: {},
  combat: {
    armorClass: 10,
    hitPoints: 10,
    baseAttackBonus: 0,
  },
}

// Vampire: The Masquerade Template
export const VAMPIRE_TEMPLATE = {
  id: 'vampire',
  name: 'Vampire: The Masquerade',
  gameType: 'vampire',
  attributes: {
    physical: {
      strength: 1,
      dexterity: 1,
      stamina: 1,
    },
    social: {
      charisma: 1,
      manipulation: 1,
      appearance: 1,
    },
    mental: {
      perception: 1,
      intelligence: 1,
      wits: 1,
    },
  },
  disciplines: [],
  bloodPool: 10,
  willpower: 5,
  humanity: 7,
}

export const SHEET_TEMPLATES = {
  dnd5e: DND5E_TEMPLATE,
  pathfinder: PATHFINDER_TEMPLATE,
  vampire: VAMPIRE_TEMPLATE,
}

export const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2)
}

export const calculateSkillBonus = (
  abilityModifier: number,
  proficiency: boolean,
  proficiencyBonus: number = 2
): number => {
  return abilityModifier + (proficiency ? proficiencyBonus : 0)
}
