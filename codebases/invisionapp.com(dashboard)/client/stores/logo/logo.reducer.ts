import { Reducer } from 'redux'

import { FETCH_TEAM } from '../team'
import { DELETE_LOGO, RESET_LOGO, UPLOAD_LOGO } from './logo.actions'
import { LogoState } from './logo.types'

const initialState: LogoState = {
  deleteCompleted: false,
  isDeleting: false,
  isUploading: false,
  uploadCompleted: false
}

const logoReducer: Reducer<LogoState> = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_LOGO.FAILURE: {
      return {
        ...state,
        deleteCompleted: false,
        isDeleting: false,
        isUploading: false,
        uploadCompleted: false
      }
    }
    case DELETE_LOGO.REQUEST: {
      return {
        ...state,
        deleteCompleted: false,
        isDeleting: true,
        isUploading: false,
        uploadCompleted: false
      }
    }
    case DELETE_LOGO.SUCCESS: {
      return {
        ...state,
        deleteCompleted: true,
        isDeleting: false,
        isUploading: false,
        uploadCompleted: false,
        uri: undefined
      }
    }

    case FETCH_TEAM.SUCCESS: {
      return {
        ...state,
        uri: action?.payload?.logo
      }
    }

    case RESET_LOGO: {
      return {
        ...state,
        deleteCompleted: false,
        isDeleting: false,
        isUploading: false,
        uploadCompleted: false
      }
    }

    case UPLOAD_LOGO.FAILURE: {
      return {
        ...state,
        deleteCompleted: false,
        isDeleting: false,
        isUploading: false,
        uploadCompleted: false
      }
    }
    case UPLOAD_LOGO.REQUEST: {
      return {
        ...state,
        deleteCompleted: false,
        isDeleting: false,
        isUploading: true,
        uploadCompleted: false
      }
    }
    case UPLOAD_LOGO.SUCCESS: {
      return {
        ...state,
        deleteCompleted: false,
        isDeleting: false,
        isUploading: false,
        uploadCompleted: true,
        uri: action?.payload?.logo?.previewPutUrl
      }
    }

    default: {
      return state
    }
  }
}

export default logoReducer
