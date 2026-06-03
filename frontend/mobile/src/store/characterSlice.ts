import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CharacterState, Character } from '../types'

const initialState: CharacterState = {
  characters: [],
  selectedCharacter: null,
  loading: false,
  error: null,
}

const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    setCharacters: (state, action: PayloadAction<Character[]>) => {
      state.characters = action.payload
    },
    addCharacter: (state, action: PayloadAction<Character>) => {
      state.characters.push(action.payload)
    },
    updateCharacter: (state, action: PayloadAction<Character>) => {
      const index = state.characters.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.characters[index] = action.payload
      }
    },
    deleteCharacter: (state, action: PayloadAction<number>) => {
      state.characters = state.characters.filter((c) => c.id !== action.payload)
    },
    setSelectedCharacter: (state, action: PayloadAction<Character | null>) => {
      state.selectedCharacter = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setCharacters, addCharacter, updateCharacter, deleteCharacter, setSelectedCharacter, setLoading, setError } = characterSlice.actions
export default characterSlice.reducer
