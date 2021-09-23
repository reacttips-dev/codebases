import Immutable from 'immutable'
import { PROMOTIONS } from '../constants/action_types'

const initialState = Immutable.Map({
  authentication: Immutable.List(),
})

export default (state = initialState, action) => {
  switch (action.type) {
    case PROMOTIONS.AUTHENTICATION_SUCCESS:
      return state.set('authentication', Immutable.fromJS(action.payload.response))
    default:
      return state
  }
}

