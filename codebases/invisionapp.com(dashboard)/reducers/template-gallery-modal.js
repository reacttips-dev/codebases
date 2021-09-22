// Action Types
import * as ActionTypes from '../constants/ActionTypes'

export const initialState = {
  showModal: false
}

export default function templateGalleryModalReducer (state = initialState, action) {
  const { type, data } = action

  switch (type) {
    // View actions
    case ActionTypes.TOGGLE_TEMPLATE_GALLERY_MODAL:
      return toggleTemplateGalleryModal(state, data)

    default:
      return state
  }
}

function toggleTemplateGalleryModal (state, data) {
  return Object.assign({}, state, {
    showModal: !state.showModal
  })
}
