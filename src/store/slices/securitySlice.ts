import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SecurityState = {
  unlocked: boolean
}

const initialState: SecurityState = {
  unlocked: false,
}

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    setUnlocked: (state, action: PayloadAction<boolean>) => {
      state.unlocked = action.payload
    },
  },
})

export const { setUnlocked } = securitySlice.actions
export default securitySlice.reducer
