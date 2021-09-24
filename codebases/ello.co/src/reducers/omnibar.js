import Immutable from 'immutable'
import { AUTHENTICATION, OMNIBAR, PROFILE } from '../constants/action_types'

const initialState = Immutable.Map({
  classList: null,
  isActive: false,
})

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATION.LOGOUT_SUCCESS:
    case AUTHENTICATION.LOGOUT_FAILURE:
    case AUTHENTICATION.REFRESH_FAILURE:
    case PROFILE.DELETE_SUCCESS:
      return initialState
    case OMNIBAR.OPEN:
    case OMNIBAR.CLOSE:
      return state.merge(action.payload)
    default:
      return state
  }
}
