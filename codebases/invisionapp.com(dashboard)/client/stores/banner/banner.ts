import { Reducer } from 'redux'
import { AppState } from '../index'

export type BannerState = {
  message: string
  show: boolean
  status: BannerStatus
}

export type BannerStatus = 'info' | 'success' | 'danger' | 'warning'

export const SHOW = 'banner/SHOW'
export const HIDE = 'banner/HIDE'

// Actions

export const hideBanner = () => {
  return { type: HIDE }
}

export const showBanner = ({ message, status }: { message: string; status: BannerStatus }) => {
  return {
    type: SHOW,
    payload: { message, status }
  }
}

// Reducer

const initialState: BannerState = {
  message: '',
  show: false,
  status: 'danger'
}

const bannerReducer: Reducer<BannerState> = (state = initialState, action) => {
  switch (action.type) {
    case SHOW: {
      return {
        ...state,
        show: true,
        ...action.payload
      }
    }
    case HIDE: {
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

// Selectors
export const selectBanner = (state: AppState) => state.banner

export default bannerReducer
