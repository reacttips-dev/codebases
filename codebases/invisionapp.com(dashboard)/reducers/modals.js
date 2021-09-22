import createReducer from '../utils/create-reducer'
import * as ActionTypes from '../constants/ActionTypes'
import {
  MODAL_BATCH_ADD,
  MODAL_MIGRATED_DOCS
} from '../constants/ModalTypes'

export const initialState = {
  ariaLabel: '',
  data: {},
  open: false,
  type: ''
}

const actionHandlers = {
  [ActionTypes.CLOSE_MODAL]: () => ({
    open: false
  }),

  [ActionTypes.OPEN_BATCH_ADD_MODAL]: (state, data) => ({
    ariaLabel: MODAL_BATCH_ADD.ariaLabel,
    data,
    type: MODAL_BATCH_ADD.key,
    open: true
  }),

  [ActionTypes.OPEN_MIGRATED_DOCS_MODAL]: (state, data) => ({
    ariaLabel: MODAL_MIGRATED_DOCS.ariaLabel,
    data,
    type: MODAL_MIGRATED_DOCS.key,
    open: true
  })
}

export default createReducer(initialState, actionHandlers)
