import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SideBarType = boolean

type SideBarState = {
  opened: SideBarType
}

const initialState: SideBarState = {
  opened: false,
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.opened = !state.opened
    },
  },
})

export const { toggleSidebar } = sidebarSlice.actions
export default sidebarSlice.reducer
