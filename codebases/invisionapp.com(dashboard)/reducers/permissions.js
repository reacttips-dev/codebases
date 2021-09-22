import * as ActionTypes from '../constants/action-types'
import createReducer from '../utils/create-reducer'

export const initialState = {
  createDocuments: false,
  createSpaces: false,
  isLoading: true
}

const actionHandlers = {
  [ActionTypes.API_GET_PERMISSIONS.SUCCESS]: (_, payload) => {
    const permissions = payload || initialState
    return {
      createDocuments: permissions.createDocuments,
      createSpaces: permissions.createSpaces,
      isLoading: false
    }
  },

  [ActionTypes.API_GET_PERMISSIONS.FAILURE]: () => initialState
}

export default createReducer(initialState, actionHandlers)
