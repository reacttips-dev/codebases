import * as ActionTypes from '../constants/action-types'
import createReducer from '../utils/create-reducer'

export const initialState = {
  location: window.location.pathname,
  open: false,
  isCondensed: false,
  teamSettingsOpen: null
}

const actionHandlers = {
  [ActionTypes.LINK_CLICKED]: (_, data) => ({
    location: data
  }),

  [ActionTypes.SET_CONDENSED_STATE]: (_, data) => ({
    isCondensed: data
  }),

  [ActionTypes.TOGGLE_SIDEBAR]: (state, _) => ({
    open: !state.open
  }),

  [ActionTypes.TOGGLE_CONDENSED_SIDEBAR]: (state, _) => ({
    isCondensed: !state.isCondensed
  }),

  [ActionTypes.TOGGLE_TEAM_SETTINGS]: (state, data) => ({
    teamSettingsOpen: data
  })
}

export default createReducer(initialState, actionHandlers)
