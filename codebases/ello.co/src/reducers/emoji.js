import Immutable from 'immutable'
import { EDITOR } from '../constants/action_types'

export const initialState = Immutable.Map()

export default (state = initialState, action) => {
  switch (action.type) {
    case EDITOR.EMOJI_COMPLETER_SUCCESS:
      return state.merge(Immutable.fromJS(action.payload.response))
    default:
      return state
  }
}

