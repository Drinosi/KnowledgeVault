import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Entry } from '../../domain/Entry'

type EntriesState = {
  entries: Entry[]
}

const initialState: EntriesState = {
  entries: [],
}

const entriesSlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    setEntries(state, action: PayloadAction<Entry[]>) {
      state.entries = action.payload
    },
    addEntry(state, action: PayloadAction<Entry>) {
      state.entries.push(action.payload)
    },
    updateEntry(state, action: PayloadAction<Entry>) {
      const index = state.entries.findIndex(e => e.id === action.payload.id)
      if (index >= 0) {
        state.entries[index] = action.payload
      }
    },
    removeEntry(state, action: PayloadAction<string>) {
      state.entries = state.entries.filter(e => e.id !== action.payload)
    },
    clearEntries(state) {
      state.entries = []
    },
  },
})

export const { setEntries, addEntry, updateEntry, removeEntry, clearEntries } = entriesSlice.actions
export default entriesSlice.reducer
