import { Reducer } from 'redux'
import arrayToObject from '../../helpers/arrayToObj'
import {
  FETCH,
  FETCH_AND_REPLACE,
  FETCH_ONE,
  REMOVE_INVITE_FROM_STORE,
  RESEND,
  RESET_STATUS,
  SEND,
  UPDATE
} from './invitations.actions'
import { Invitation, InvitationsState } from './invitations.types'

const initialState: InvitationsState = {
  data: {},
  deleteSuccess: false,
  invitesToSend: [],
  isDeleting: false,
  isLoading: false,
  isUpdating: false,
  isResending: false,
  isSending: false,
  resendInviteId: null,
  resendSuccess: false,
  sendFailure: false,
  sendSuccess: false,
  updateSuccess: false
}

const invitiationsReducer: Reducer<InvitationsState> = (state = initialState, action) => {
  switch (action.type) {
    case FETCH.REQUEST: {
      return {
        ...state,
        isLoading: true
      }
    }
    case FETCH.SUCCESS: {
      return {
        ...state,
        isLoading: false,
        data: {
          ...state.data,
          ...arrayToObject(action.payload.results)
        }
      }
    }

    case FETCH_AND_REPLACE.REQUEST: {
      return {
        ...state
      }
    }
    case FETCH_AND_REPLACE.SUCCESS: {
      return {
        ...initialState,
        data: {
          ...arrayToObject(action.payload.results)
        }
      }
    }
    case FETCH_AND_REPLACE.FAILURE: {
      return {
        ...state
      }
    }

    case FETCH_ONE.SUCCESS: {
      return {
        ...state,
        data: {
          [action.payload.id]: {
            ...action.payload
          }
        }
      }
    }

    case UPDATE.REQUEST: {
      return {
        ...state,
        isUpdating: true
      }
    }
    case UPDATE.SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.data.id]: {
            ...action.payload.data
          }
        },
        isUpdating: false
      }
    }
    case UPDATE.FAILURE: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.invitationId]: {
            ...(state.data[action.invitationId] as Invitation)
          }
        },
        isUpdating: false
      }
    }

    case REMOVE_INVITE_FROM_STORE: {
      const newState = { ...state }
      delete newState.data[action.inviteId]
      return newState
    }

    case RESEND.REQUEST: {
      return {
        ...state,
        isResending: true,
        resendInviteId: action.id
      }
    }
    case RESEND.SUCCESS: {
      return {
        ...state,
        isResending: false,
        resendSuccess: true
      }
    }
    case RESEND.FAILURE: {
      return {
        ...state,
        isResending: false,
        resendSuccess: false
      }
    }

    case RESET_STATUS: {
      return {
        ...state,
        deleteSuccess: false,
        isDeleting: false,
        isLoading: false,
        isResending: false,
        isSending: false,
        isUpdating: false,
        resendInviteId: null,
        resendSuccess: false,
        sendFailure: false,
        sendSuccess: false,
        updateSuccess: false
      }
    }

    case SEND.REQUEST: {
      return {
        ...state,
        isSending: true,
        sendSuccess: false,
        sendFailure: false
      }
    }
    case SEND.SUCCESS: {
      return {
        ...state,
        invitesToSend: [...action.payload.invites],
        isSending: false,
        sendSuccess: true,
        sendFailure: false
      }
    }
    case SEND.FAILURE: {
      return {
        ...state,
        isSending: false,
        sendSuccess: false,
        sendFailure: false
      }
    }
    default: {
      return state
    }
  }
}

export default invitiationsReducer
