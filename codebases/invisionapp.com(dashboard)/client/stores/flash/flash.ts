import { Dispatch, Reducer } from 'redux'
import { FlashState, FlashStatus } from './flash.types'

export const SHOW_FLASH = 'flash/SHOW'
export const HIDE_FLASH = 'flash/HIDE'

let toastTimeout: number

// Actions

export const hideFlash = () => {
  clearTimeout(toastTimeout)
  return { type: HIDE_FLASH }
}

export const showFlash = ({
  message,
  status,
  undoId
}: {
  message: string
  status: FlashStatus
  undoId?: number
}) => (dispatch: Dispatch) => {
  // Reset everything
  clearTimeout(toastTimeout)
  dispatch(hideFlash())

  // on next tick
  setTimeout(
    () =>
      dispatch({
        type: SHOW_FLASH,
        payload: { message, status, undoId }
      }),
    0
  )

  toastTimeout = setTimeout(() => {
    clearTimeout(toastTimeout)
    dispatch(hideFlash())
  }, 6000) // one second longer than Helios lets the toast stick around
}

// Reducer

const initialState: FlashState = {
  message: '',
  show: false,
  status: 'success'
}

const flashReducer: Reducer<FlashState> = (
  state: FlashState = initialState,
  action
): FlashState => {
  switch (action.type) {
    case SHOW_FLASH: {
      return {
        ...state,
        show: true,
        ...action.payload
      }
    }
    case HIDE_FLASH: {
      return {
        ...state,
        show: false,
        message: ''
      }
    }
    default: {
      return state
    }
  }
}

export default flashReducer
