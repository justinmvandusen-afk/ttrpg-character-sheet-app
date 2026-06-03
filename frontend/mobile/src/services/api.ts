import axios, { AxiosInstance } from 'axios'
import * as SecureStore from 'expo-secure-store'

const API_URL = 'http://localhost:8000/api'

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
    })

    // Add token to requests
    this.client.interceptors.request.use(async (config) => {
      try {
        const token = await SecureStore.getItemAsync('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Error getting token:', error)
      }
      return config
    })
  }

  // Auth endpoints
  async register(username: string, email: string, password: string) {
    return this.client.post('/auth/register', {
      username,
      email,
      password,
    })
  }

  async login(username: string, password: string) {
    return this.client.post('/auth/login', {
      username,
      password,
    })
  }

  // Game endpoints
  async getGames() {
    return this.client.get('/games')
  }

  async createGame(name: string, game_type: string, description?: string) {
    return this.client.post('/games', {
      name,
      game_type,
      description,
    })
  }

  async updateGame(gameId: number, data: any) {
    return this.client.put(`/games/${gameId}`, data)
  }

  async deleteGame(gameId: number) {
    return this.client.delete(`/games/${gameId}`)
  }

  // Character endpoints
  async getCharacters() {
    return this.client.get('/characters')
  }

  async createCharacter(gameId: number, name: string, level?: number) {
    return this.client.post('/characters', {
      game_id: gameId,
      name,
      level: level || 1,
    })
  }

  async updateCharacter(characterId: number, data: any) {
    return this.client.put(`/characters/${characterId}`, data)
  }

  async deleteCharacter(characterId: number) {
    return this.client.delete(`/characters/${characterId}`)
  }

  // Sheet endpoints
  async getSheetTemplate(gameType: string) {
    return this.client.get(`/sheets/templates/${gameType}`)
  }

  async createSheet(characterId: number, sheetType: string, data?: any) {
    return this.client.post('/sheets', {
      character_id: characterId,
      name: 'Main Sheet',
      sheet_type: sheetType,
      data: data || {},
    })
  }

  async updateSheet(sheetId: number, data: any) {
    return this.client.put(`/sheets/${sheetId}`, data)
  }
}

export default new APIClient()
