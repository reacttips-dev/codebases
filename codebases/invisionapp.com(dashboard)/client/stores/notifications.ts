import { Reducer } from 'redux'
import { createAction } from 'redux-actions'
import { LOCATION_CHANGE } from 'react-router-redux'
import { DELETE_LOGO, UPLOAD_LOGO } from './logo'
import { AppState } from './index'

export type NotificationsState = {
  message?: string
  type?: string
  linkLabel?: string
  linkTo?: string
}

// Action Constants
export const CREATE = 'teams/notifications/CREATE'
export const CLEAR = 'teams/notifications/CLEAR'

// Events listed here will be intercepted by the notification middleware
export const NOTIFICATION_EVENTS = [DELETE_LOGO.FAILURE, UPLOAD_LOGO.FAILURE]

// Actions
export const createNotification = ({
  message,
  type,
  linkLabel,
  linkTo
}: NotificationsState) => ({
  type: CREATE,
  payload: {
    message,
    type,
    linkLabel,
    linkTo
  }
})

export const clearNotification = createAction(CLEAR)

// State
const initialState: NotificationsState = {}

// Reducers
const notificationsReducer: Reducer<NotificationsState> = (state = initialState, action) => {
  switch (action.type) {
    case CREATE: {
      return {
        ...action.payload
      }
    }
    case CLEAR: {
      return {
        ...initialState
      }
    }
    case LOCATION_CHANGE: {
      return {
        ...initialState
      }
    }
    default: {
      return state
    }
  }
}

export default notificationsReducer

// Selectors
export const selectNotification = (state: AppState) => state.notification
export const showNotification = (state: AppState) => !!state.notification.type
