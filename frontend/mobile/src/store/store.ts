import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import gameReducer from './gameSlice'
import characterReducer from './characterSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    character: characterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
