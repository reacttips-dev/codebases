import { Reducer } from 'redux'
import {
  CLEAR_VALIDATION,
  FETCH_USER,
  FETCH_ACCOUNT_TEAMS,
  FETCH_PREFERENCES,
  FETCH_PROFILE,
  FETCH_TEAMS,
  SEND_CODE,
  UPDATE_NOTIFICATIONS,
  UPDATE_PASSWORD,
  UPDATE_PROFILE,
  VALIDATE_CODE
} from './user.actions'
import { UserState } from './user.types'

export const initialState: UserState = {
  codeSent: false,
  isSendingCode: false,
  validationRequested: false,
  codeIsValid: false,
  isValidatingCode: false,
  isLoading: false,
  isLoaded: false,
  isUpdating: false,
  didPasswordUpdate: false,
  accountSettingsError: false,
  accountSettingsSuccess: false,
  loadingTeamsStatus: 'initial',
  teams: [],
  invitations: []
}

const userReducer: Reducer<UserState> = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_VALIDATION: {
      return { ...state, ...initialState }
    }

    case FETCH_ACCOUNT_TEAMS.SUCCESS: {
      return {
        ...state,
        teams: action.payload?.teams ?? [],
        loadingTeamsStatus: 'loaded'
      }
    }

    case FETCH_PREFERENCES.SUCCESS: {
      return {
        ...state,
        ...action.payload,
        accountSettingsError: false,
        accountSettingsSuccess: false
      }
    }

    case FETCH_PROFILE.SUCCESS: {
      return {
        ...state,
        ...action.payload,
        accountSettingsError: false,
        accountSettingsSuccess: false
      }
    }

    case FETCH_TEAMS.FAILURE: {
      return { ...state, loadingTeamsStatus: 'loaded' } // TODO: need to handle error }
    }
    case FETCH_TEAMS.REQUEST: {
      return { ...state, loadingTeamsStatus: 'loading' }
    }
    case FETCH_TEAMS.SUCCESS: {
      return {
        ...state,
        teams: action.payload?.teams ?? [],
        invitations: action.payload?.invitations ?? [],
        accountSettingsError: false,
        accountSettingsSuccess: false,
        loadingTeamsStatus: 'loaded'
      }
    }

    case FETCH_USER.FAILURE: {
      return {
        ...state,
        isLoading: false,
        isLoaded: false
      }
    }
    case FETCH_USER.REQUEST: {
      return {
        ...state,
        isLoading: true,
        isLoaded: false
      }
    }
    case FETCH_USER.SUCCESS: {
      return { ...state, ...action.payload, isLoading: false, isLoaded: true }
    }

    case SEND_CODE.REQUEST: {
      return { ...state, isSendingCode: true, codeSent: false }
    }
    case SEND_CODE.SUCCESS: {
      return { ...state, isSendingCode: false, codeSent: true }
    }
    case SEND_CODE.FAILURE: {
      return { ...state, isSendingCode: false, codeSent: false }
    }

    case UPDATE_NOTIFICATIONS.REQUEST: {
      return {
        ...state,
        isUpdating: true,
        didNotificationsUpdate: false,
        accountSettingsError: false,
        accountSettingsSuccess: false
      }
    }
    case UPDATE_NOTIFICATIONS.SUCCESS: {
      return { ...state, isUpdating: false, didNotificationsUpdate: true }
    }
    case UPDATE_NOTIFICATIONS.FAILURE: {
      return {
        ...state,
        isUpdating: false,
        didNotificationsUpdate: false,
        accountSettingsError: action.payload.message
      }
    }

    case UPDATE_PASSWORD.REQUEST: {
      return {
        ...state,
        accountSettingsError: false,
        accountSettingsSuccess: false,
        didPasswordUpdate: false,
        isUpdating: true
      }
    }

    case UPDATE_PROFILE.FAILURE: {
      return {
        ...state,
        isUpdating: false,
        didUserUpdate: false,
        accountSettingsError: 'Your profile could not be updated. Please try again.'
      }
    }
    case UPDATE_PROFILE.REQUEST: {
      return {
        ...state,
        accountSettingsError: false,
        accountSettingsSuccess: false,
        didAvatarUpdate: false,
        didUserUpdate: false,
        isUpdating: true
      }
    }
    case UPDATE_PROFILE.SUCCESS: {
      return { ...state, isUpdating: false, didUserUpdate: true }
    }

    case VALIDATE_CODE.REQUEST: {
      return { ...state, isValidatingCode: true }
    }

    default: {
      return state
    }
  }
}

export default userReducer
