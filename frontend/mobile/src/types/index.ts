export interface Character {
  id: number
  name: string
  game_id: number
  level: number
  experience: number
  description?: string
  created_at: string
}

export interface Game {
  id: number
  name: string
  game_type: string
  description?: string
  owner_id: number
  created_at: string
}

export interface CharacterSheet {
  id: number
  character_id: number
  name: string
  sheet_type: string
  data: Record<string, any>
  created_at: string
}

export interface User {
  id: number
  username: string
  email: string
  full_name?: string
  is_active: boolean
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  loading: boolean
  error: string | null
}

export interface GameState {
  games: Game[]
  selectedGame: Game | null
  loading: boolean
  error: string | null
}

export interface CharacterState {
  characters: Character[]
  selectedCharacter: Character | null
  loading: boolean
  error: string | null
}
