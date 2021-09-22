import { GenerateIDURL } from '../utils/urlIDParser'
import { generatePrototypeUrl } from '../utils/prototypeUrl'
import { BOARD, FREEHAND, PROTOTYPE, RHOMBUS, SPEC } from '../constants/DocumentTypes'

// Action Types
import * as ActionTypes from '../constants/ActionTypes'
import errorMessages from '../constants/ErrorMessages'

import createReducer from '../utils/create-reducer'
import { navigate } from '../utils/navigation'

export const initialState = () => ({
  showModal: false,
  sidebarEnabled: true,
  subview: 'projectTypes',
  error: null,
  isCreating: false,
  isOnboarding: false,
  isPublic: true
})

const projectCreated = (state, { type, response }) => {
  let url = null

  switch (type) {
    case FREEHAND:
      url = response.document.path
      break

    case PROTOTYPE:
      url = generatePrototypeUrl(response.data.hash, response.data.id, response.data.name)
      break

    case RHOMBUS:
      url = response.document.url
      break

    case BOARD:
      const id = GenerateIDURL(response.hash, response.title)
      url = `/board/${id}`
      break

    case SPEC:
      const specId = response.data && response.data.id
      url = `/spec/${specId}`
      break

    default:
      break
  }

  if (url) {
    // TODO: this side-effect should be in a saga, not a reducer
    setTimeout(() => {
      navigate(url)
    }, 150)

    return {
      subview: 'projectTypes',
      showModal: false,
      isCreating: false
    }
  } else {
    return {
      subview: 'projectTypes',
      showModal: false,
      isCreating: false
    }
  }
}

const projectError = (_, { type, response }) => {
  let error = response

  if (type === PROTOTYPE) {
    error = {
      element: '',
      title: '',
      description: '',
      className: ''
    }

    // Need to validate data.response and that it contains messages else
    // nothing is assigned to errorMessage. This causes it to break.
    const errorMessage = (
      (response && ((response.error && response.error.message) || response.message)) ||
      'ServerError'
    )

    switch (errorMessage) {
      case 'Prototype.Conflict.OnCreate':
        error.element = 'name'
        error.title = 'Try Again'
        error.description = 'This prototype name already exists. Please choose a unique name.'
        error.className = 'duplicate-name'
        break
      case 'Unauthorized.CreatePrototype':
        error.element = 'owner'
        error.title = 'Oops! Invalid Account'
        error.description = 'You are not authorized to create the prototype. If you believe this is a mistake, please talk to your team administrator.'
        error.className = 'invalid-account'
        break
      default:
        error.element = 'name'
        error.title = 'Try Again'
        error.description = 'There\'s been an error with creating your prototype. Please try again.'
        error.className = 'invalid-name'
        break
    }
  }

  if (type === SPEC) {
    error = {
      element: 'name',
      title: 'Try again',
      description: 'There\'s been an error with creating your spec. Please try again.'
    }

    // Need to validate data.response and that it contains messages else
    // nothing is assigned to errorMessage. This causes it to break.
    const errorMessage = response && ((response.error && response.error.message) || response.message)
    if (errorMessage) {
      error.description = errorMessage
    }
  }

  return {
    error,
    isCreating: false
  }
}

const spaceCreated = (state, response) => {
  return {
    subview: 'projectTypes',
    showModal: false,
    isCreating: false
  }
}

const spaceError = (_, data) => {
  const error = {
    className: 'invalid-name',
    description: 'Looks like you already have a space with that name.',
    element: 'name',
    title: 'Try Again.'
  }

  if (data && data.response === 422) {
    error.className = 'duplicate-name'
    error.description = 'Looks like you already have a space with that name.'
  } else {
    const match = data && data.response && data.response.message && data.response.message.match(/"INVALID_SPACE_TITLE: (([A-Z]|_)+)"/)
    if (match && match.length > 1 && match[1]) {
      if (errorMessages[match[1]]) error.description = errorMessages[match[1]]
      if (match[1] === 'TITLE_NOT_UNIQUE') error.className = 'duplicate-name'
    }
  }

  return {
    error,
    isCreating: false
  }
}

const actionHandlers = {
  [ActionTypes.API_CREATE_DOCUMENT.REQUEST]: () => ({ isCreating: true }),
  [ActionTypes.API_CREATE_DOCUMENT.SUCCESS]: projectCreated,
  [ActionTypes.API_CREATE_DOCUMENT.FAILURE]: projectError,

  [ActionTypes.API_CREATE_SPACE.SUCCESS]: spaceCreated,
  [ActionTypes.API_CREATE_SPACE.FAILURE]: spaceError,

  [ActionTypes.CREATE_MODAL_CLOSE]: () => ({
    subview: 'projectTypes',
    showModal: false,
    isCreating: false,
    isOnboarding: false
  }),

  [ActionTypes.CREATE_MODAL_FAIL]: (_, error) => ({ error }),

  [ActionTypes.CREATE_MODAL_OPEN]: (_, { subview }) => ({
    subview: subview || 'projectTypes',
    showModal: true,
    isCreating: false
  }),

  [ActionTypes.CREATE_MODAL_OPEN_ONBOARDING]: (_, { subview }) => ({
    subview: subview || 'projectTypes',
    showModal: true,
    isCreating: false,
    isOnboarding: true
  }),

  [ActionTypes.CREATE_MODAL_REMOVE_ERROR]: () => ({ error: null }),

  [ActionTypes.CREATE_MODAL_RESET]: () => initialState(),

  [ActionTypes.SET_SPACE_TYPE]: (_, data) => ({ isPublic: data.isPublic })
}

export default createReducer(initialState(), actionHandlers)
