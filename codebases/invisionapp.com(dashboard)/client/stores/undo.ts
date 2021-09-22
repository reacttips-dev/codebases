import { Reducer, Dispatch } from 'redux'
import { AppState } from './index'

export type UndoState = {
  [key: string]: {
    timeoutId: any
    queueAction: QueueAction
  }
}

type QueueAction = {
  id: string
  timeout: number
  initialAction: any
  delayedAction: any
  undoAction: any
}

export const QUEUE = 'undo/queue'
export const UNDO = 'undo/undo'

export const queue = (queueAction: QueueAction) => (dispatch: Dispatch<any>) => {
  dispatch(queueAction.initialAction)

  const timeoutId = setTimeout(() => {
    dispatch(queueAction.delayedAction)
  }, queueAction.timeout)

  dispatch({
    type: QUEUE,
    payload: { id: queueAction.id, timeoutId, queueAction }
  })
}

export const undo = (id: string) => (dispatch: Dispatch<any>, getState: () => AppState) => {
  try {
    const state = getState()
    clearTimeout(state.undo[id].timeoutId)

    dispatch(state.undo[id].queueAction.undoAction)

    dispatch({
      type: UNDO,
      payload: id
    })
  } catch (e) {} // eslint-disable-line
}

const initialState: UndoState = {}

const undoReducer: Reducer<UndoState> = (state = initialState, action) => {
  switch (action.type) {
    case QUEUE: {
      return {
        ...state,
        [action.payload.id]: action.payload
      }
    }
    case UNDO: {
      return {
        ...state,
        [action.payload]: undefined
      }
    }
    default: {
      return state
    }
  }
}

export default undoReducer
