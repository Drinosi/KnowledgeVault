import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type NotificationType = 'success' | 'error' | 'default'

type NotificationState = {
  type: NotificationType
  message: string
}

const initialState: NotificationState = {
  type: 'default',
  message: '',
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (
      state,
      action: PayloadAction<{ type: NotificationType; message: string }>,
    ) => {
      state.type = action.payload.type
      state.message = action.payload.message
    },
    clearNotification: state => {
      state.type = 'default'
      state.message = ''
    },
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
