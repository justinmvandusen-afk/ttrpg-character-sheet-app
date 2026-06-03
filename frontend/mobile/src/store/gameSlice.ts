import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameState, Game } from '../types'

const initialState: GameState = {
  games: [],
  selectedGame: null,
  loading: false,
  error: null,
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGames: (state, action: PayloadAction<Game[]>) => {
      state.games = action.payload
    },
    addGame: (state, action: PayloadAction<Game>) => {
      state.games.push(action.payload)
    },
    updateGame: (state, action: PayloadAction<Game>) => {
      const index = state.games.findIndex((g) => g.id === action.payload.id)
      if (index !== -1) {
        state.games[index] = action.payload
      }
    },
    deleteGame: (state, action: PayloadAction<number>) => {
      state.games = state.games.filter((g) => g.id !== action.payload)
    },
    setSelectedGame: (state, action: PayloadAction<Game | null>) => {
      state.selectedGame = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setGames, addGame, updateGame, deleteGame, setSelectedGame, setLoading, setError } = gameSlice.actions
export default gameSlice.reducer
