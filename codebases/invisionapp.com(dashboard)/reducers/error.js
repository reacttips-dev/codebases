// Action Types
import * as ActionTypes from '../constants/ActionTypes'
import { PROTOTYPE } from '../constants/DocumentTypes'

export const initialState = {
  showModal: false,
  errorMessage: ''
}

export default function errorReducer (state = initialState, action) {
  var { type, data } = action

  switch (type) {
    // Server actions
    case ActionTypes.API_CREATE_DOCUMENT.FAILURE:
      if (data.type !== PROTOTYPE) {
        return toggleErrorModal(
          state,
          'There was an error creating your document. Please try again.',
          true
        )
      }

      return state

    case ActionTypes.API_GET_RECENTS.FAILURE:
      return toggleErrorModal(
        state,
        'There was an error loading your recent documents. Please try again.',
        true
      )

    case ActionTypes.API_GET_ACCOUNT.FAILURE:
    case ActionTypes.API_GET_CONFIG.FAILURE:
      return toggleErrorModal(
        state,
        'There was an error loading your account information. Give it a few minutes, then please try again.',
        true
      )

    case ActionTypes.API_DELETE_DOCUMENT.FAILURE:
      return toggleErrorModal(
        state,
        'There was an error deleting your document. Please try again.',
        true
      )

    case ActionTypes.API_DELETE_SPACE.FAILURE:
      return toggleErrorModal(
        state,
        'There was an error deleting your space. Please try again.',
        true
      )

    case ActionTypes.UPLOAD_ICON.REQUEST_UPLOAD_FAILURE:
      return toggleErrorModal(
        state,
        'There was an error uploading your icon. Please try again.',
        true
      )

    case ActionTypes.API_JOIN_DOCUMENT.FAILURE:
      return toggleErrorModal(
        state,
        'There was an error joining this document. Please try again.',
        true
      )

    case ActionTypes.LOAD_TEMP_IMAGE.FAILURE:
      return toggleErrorModal(state, data.response, true)

    // View actions
    case ActionTypes.TOGGLE_ERROR_MODAL:
      return toggleErrorModal(state, data.message)

    default:
      return state
  }
}

function toggleErrorModal (state, message, forceTrue) {
  var showModal = forceTrue ? true : !state.showModal

  return Object.assign({}, state, {
    showModal: showModal,
    errorMessage: message
  })
}
