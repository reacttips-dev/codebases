import * as ActionTypes from '../constants/action-types'
import createReducer from '../utils/create-reducer'

export const initialState = {
  open: false,
  isCreating: false,
  error: null,
  createdSpaceData: null,
  createdProjectData: null,
  modalData: null,
  type: ''
}

export const DEFAULT_SPACE_CREATE_ERROR = 'Sorry, an error occurred when creating a space.'
export const DUPLICATE_SPACE_NAME_ERROR = 'Looks like you already have a space with that name.'
export const INVALID_SPACE_MAME_ERROR = 'Invalid space name.'

export const spaceError = (_, data) => {
  let error = DEFAULT_SPACE_CREATE_ERROR
  if (data && data.message && data.message + '' === '422') {
    error = DUPLICATE_SPACE_NAME_ERROR
  } else {
    const match = data && data && data.message && data.message.match(/.*INVALID_SPACE_TITLE:(.*)/)
    if (match && match.length > 1 && match[1]) {
      error = INVALID_SPACE_MAME_ERROR
    }
  }

  return {
    error,
    isCreating: false
  }
}

const actionHandlers = {
  [ActionTypes.SHOW_MODAL]: (_, { type, modalData = null }) => ({
    open: true,
    type,
    modalData
  }),
  [ActionTypes.CLOSE_MODAL]: () => ({
    open: false,
    type: '',
    error: null
  }),
  [ActionTypes.API_CREATE_PROJECT.FAILURE]: (_, data) => ({
    error: data.error || 'There was an error creating your project',
    errorCode: data,
    isCreating: data !== 409
  }),
  [ActionTypes.API_CREATE_PROJECT.REQUEST]: () => ({
    error: null,
    isCreating: true,
    createdProjectData: null
  }),
  [ActionTypes.API_CREATE_PROJECT.SUCCESS]: (_, { data, context }) => ({
    error: null,
    isCreating: false,
    open: false,
    type: '',
    createdProjectData: { ...data, context }
  }),
  [ActionTypes.API_UPDATE_PROJECT_SIDEBAR.SUCCESS]: () => ({
    error: null,
    isCreating: false,
    open: false,
    type: ''
  }),
  [ActionTypes.API_CREATE_SPACE.REQUEST]: () => ({
    createdSpaceData: null,
    isCreating: true,
    error: null
  }),
  [ActionTypes.API_CREATE_SPACE.SUCCESS]: (_, data) => {
    return {
      open: false,
      isCreating: false,
      createdSpaceData: data
    }
  },
  [ActionTypes.API_CREATE_SPACE.FAILURE]: spaceError
}

export default createReducer(initialState, actionHandlers)
