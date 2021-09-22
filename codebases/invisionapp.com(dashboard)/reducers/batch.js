import update from 'immutability-helper'

import * as ActionTypes from '../constants/ActionTypes'
import createReducer from '../utils/create-reducer'

export const initialState = {
  activeDocument: -1,
  errors: [],
  filterText: '',
  isLoading: true,
  lastDocumentSelected: false,
  selected: []
}

const actionHandlers = {
  [ ActionTypes.API_ADD_DOCUMENTS_TO_SPACE.SUCCESS ]: () => ({
    filterText: '',
    lastDocumentSelected: false,
    selected: []
  }),

  [ ActionTypes.API_MOVE_DOCUMENTS_TO_CONTAINER.SUCCESS ]: () => ({
    filterText: '',
    lastDocumentSelected: false,
    selected: []
  }),

  [ ActionTypes.CLOSE_MODAL ]: () => ({
    activeDocument: -1,
    errors: [],
    filterText: '',
    selected: []
  }),

  [ ActionTypes.NAVIGATE_ACTIVE_DOCUMENT ]: (state, data) => ({
    activeDocument: Math.max(data === 'up' ? state.activeDocument - 1 : state.activeDocument + 1, 0)
  }),

  [ ActionTypes.REMOVE_SELECTED_DOCUMENT ]: (state, data) => ({
    selected: update(state.selected, {
      '$splice': [[data.index, 1]]
    })
  }),

  [ ActionTypes.SELECT_ACTIVE_DOCUMENT ]: (state, data) => ({
    selected: update(state.selected, {
      '$push': [data]
    })
  }),

  [ ActionTypes.SELECT_LAST_DOCUMENT ]: () => ({
    lastDocumentSelected: true
  }),

  [ ActionTypes.SET_ACTIVE_DOCUMENT ]: (_, data) => ({
    activeDocument: data,
    lastDocumentSelected: false
  }),

  [ ActionTypes.UPDATE_BATCH_FILTER_TEXT ]: (state, data) => ({
    activeDocument: data !== '' ? 0 : -1,
    filterText: data,
    lastDocumentSelected: data !== '' ? false : state.lastDocumentSelected
  })
}

export default createReducer(initialState, actionHandlers)
