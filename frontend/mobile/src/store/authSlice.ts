import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, User } from '../types'

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    setTokens: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.error = null
    },
  },
})

export const { setLoading, setError, setUser, setTokens, logout } = authSlice.actions
export default authSlice.reducer
