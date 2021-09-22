// Action Types
import * as ActionTypes from '../constants/ActionTypes'

export const initialState = () => (null)

export default function paywallReducer (state = initialState(), action) {
  switch (action.type) {
    case ActionTypes.SET_PAYWALL:
      return {
        ...action.data
      }

    default:
      return state
  }
}
