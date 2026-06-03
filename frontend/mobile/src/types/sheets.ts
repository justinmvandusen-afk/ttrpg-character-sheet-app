export interface Ability {
  name: string
  base: number
  modifier?: number
}

export interface Skill {
  name: string
  ability: string
  proficiency: boolean
  bonus?: number
}

export interface SheetTemplate {
  id: string
  name: string
  gameType: string
  abilities: Record<string, Ability>
  skills: Record<string, Skill>
  combat: CombatStats
  other?: Record<string, any>
}

export interface CombatStats {
  armorClass: number
  hitPoints: number
  hitDice?: string
  speed?: number
  initiative?: number
  proficiencyBonus?: number
}

export interface DND5eSheet extends SheetTemplate {
  gameType: 'dnd5e'
  class: string
  race: string
  background: string
  alignment: string
  deathSaves?: {
    successes: number
    failures: number
  }
  features?: string[]
}

export interface PathfinderSheet extends SheetTemplate {
  gameType: 'pathfinder'
  class: string
  race: string
  deity?: string
  baseAttackBonus: number
  features?: string[]
}

export interface VampireSheet {
  gameType: 'vampire'
  clan: string
  generation: number
  attributes: {
    physical: Record<string, number>
    social: Record<string, number>
    mental: Record<string, number>
  }
  disciplines: string[]
  bloodPool: number
  willpower: number
  humanity: number
  virtues: {
    conscience: number
    self_control: number
    courage: number
  }
}

export type CharacterSheetType = DND5eSheet | PathfinderSheet | VampireSheet | SheetTemplate
