import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

import entriesReducer from './slices/entriesSlice'
import themeReducer from './slices/colorThemeSlice'
import securityReducer from './slices/securitySlice'

const themePersistConfig = {
  key: 'theme',
  storage: AsyncStorage,
}

const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer)

export const store = configureStore({
  reducer: {
    entries: entriesReducer,
    theme: persistedThemeReducer,
    security: securityReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
