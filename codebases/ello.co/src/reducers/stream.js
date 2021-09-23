import Immutable from 'immutable'
import {
  AUTHENTICATION,
  POST,
  PROFILE,
  USER,
} from '../constants/action_types'

const initialState = Immutable.Map()

export default (state = initialState, action = { type: '' }) => {
  if (action.type === AUTHENTICATION.LOGOUT_SUCCESS ||
      action.type === AUTHENTICATION.LOGOUT_FAILURE ||
      action.type === AUTHENTICATION.REFRESH_FAILURE ||
      action.type === PROFILE.DELETE_SUCCESS) {
    return initialState
  } else if (!(action.type === POST.DETAIL_SUCCESS || action.type === USER.DETAIL_SUCCESS ||
               action.type === POST.DETAIL_FAILURE || action.type === USER.DETAIL_FAILURE) &&
             !(action.type.indexOf('COMMENT.') === 0 && action.type.indexOf('SUCCESS') > -1) &&
             action && action.meta && action.meta.updateResult === false) {
    return state
  } else if (action.type.includes('POST.DETAIL_') ||
             action.type.includes('USER.DETAIL_') ||
             action.type.includes('LOAD_STREAM_') ||
             action.type.includes('LOAD_NEXT_CONTENT_')) {
    return state.merge(action)
  }
  return state
}

