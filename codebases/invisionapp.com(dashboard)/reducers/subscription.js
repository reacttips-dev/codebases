import * as ActionTypes from '../constants/ActionTypes'
import createReducer from '../utils/create-reducer'

export const initialState = {
  isLoading: true
}

function loadSubscription (state, repsonse) {
  return {
    isLoading: false,
    ...repsonse
  }
}

function loadSubscriptionFailure (state, error) {
  return {
    isLoading: false
  }
}

const actionHandlers = {
  [ActionTypes.API_GET_SUBSCRIPTION.SUCCESS]: loadSubscription,
  [ActionTypes.API_GET_SUBSCRIPTION.FAILURE]: loadSubscriptionFailure
}

export default createReducer(initialState, actionHandlers)
