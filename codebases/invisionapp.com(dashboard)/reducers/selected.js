import update from 'immutability-helper'

import * as ActionTypes from '../constants/ActionTypes'

import createReducer from '../utils/create-reducer'
import { MAX_SELECTED_DOCUMENTS, OVER_MAX_DOCUMENTS_ERROR_STRING } from '../constants/MoveDocumentsConstants'

export const initialState = {
  activeDocument: {},
  firstSelected: {},
  isDragging: false,
  selected: [],
  showAlert: false
}

const alertShown = (_, { message }) => {
  if (message === OVER_MAX_DOCUMENTS_ERROR_STRING) {
    return { showAlert: false }
  }
}

const deselectDocuments = (state, data) => {
  const { documents } = data

  if (documents && documents.length > 0) {
    return {
      selected: state.selected.filter(sel => {
        let selected = true
        documents.forEach(doc => {
          if (doc.id + '' === sel.id && doc.type === sel.type) selected = false
        })

        return selected
      })
    }
  }
}

const setActiveDocument = (_, { type, id }) => {
  return {
    activeDocument: {
      type,
      id
    }
  }
}

const setDragSelections = (state, { docs, shiftKey }) => {
  let selected = docs.map(doc => {
    return {
      type: doc.type,
      id: doc.id,
      title: doc.title,
      currentSpaceID: doc.currentSpaceID
    }
  })

  if (shiftKey) {
    const current = state.selected.slice(0)
    current.forEach(item => {
      if (!selected.find(s => s.id === item.id && s.type === item.type)) {
        selected.push(item)
      }
    })
  }

  if (selected.length > MAX_SELECTED_DOCUMENTS) return { showAlert: true }

  return {
    firstSelected: {},
    selected,
    showAlert: false
  }
}

const toggleDocument = (state, { type, id, title, currentSpaceID, extraDocuments }) => {
  const { selected } = state
  let addToSelected = []

  const existingIndex = state.selected.findIndex(item => {
    return item.id === id + '' && item.type === type
  })

  // The client checks for the max limit, but to avoid race conditions, we check for the limit at the reducer level as well
  if (existingIndex === -1 && selected.length >= MAX_SELECTED_DOCUMENTS) {
    return { showAlert: true }
  }

  if (extraDocuments.length > 0 && existingIndex === -1) {
    extraDocuments.forEach(d => {
      if (state.selected.findIndex(item => item.id + '' === d.id + '' && item.type === d.type) === -1) {
        addToSelected.push({ type: d.type, id: d.id + '', title: d.title, currentSpaceID: d.currentSpaceID })
      }
    })
  }

  addToSelected.push({ type: type, id: id + '', title, currentSpaceID })

  if (selected.length + addToSelected.length > MAX_SELECTED_DOCUMENTS) {
    return { showAlert: true }
  }

  return {
    selected: existingIndex === -1
      ? update(state.selected, { '$push': addToSelected })
      : update(state.selected, { '$splice': [[existingIndex, 1]] })
  }
}

const actionHandlers = {
  [ ActionTypes.DESELECT_DOCUMENTS ]: deselectDocuments,
  [ ActionTypes.SET_DRAG_SELECTIONS ]: setDragSelections,
  [ ActionTypes.SET_ACTIVE_SELECTED_DOCUMENT ]: setActiveDocument,
  [ ActionTypes.SHOW_ALERT ]: alertShown,
  [ ActionTypes.TOGGLE_SELECT_DOCUMENT ]: toggleDocument,

  // Actions to clear state
  [ ActionTypes.CLEAR_SELECTED_DOCUMENTS ]: () => initialState,

  [ ActionTypes.START_DOCUMENT_DRAG ]: (_, { first }) => {
    if (first && first.type && first.id) {
      return {
        firstSelected: {
          type: first.type,
          id: first.id,
          currentSpaceID: first.currentSpaceID || ''
        }
      }
    }
  },

  [ ActionTypes.END_DOCUMENT_DRAG ]: (state, clearDocuments) => {
    if (clearDocuments || (state.selected.length === 0 && !!state.firstSelected)) return initialState
  }
}

export default createReducer(initialState, actionHandlers)
