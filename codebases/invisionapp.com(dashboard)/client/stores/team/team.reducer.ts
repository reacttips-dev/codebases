import { Reducer } from 'redux'
import { CLEAR_VALIDATION as USER_CLEAR_VALIDATION } from '../user'
import { TeamSettings, TeamState } from './team.types'
import {
  CHECK_PAYWALL,
  DELETE_TEAM,
  FETCH_TEAM,
  SCIM_SETTINGS_FETCH,
  SETTINGS_FETCH,
  SET_TRANSFER_USER,
  SHARE_BRANDING_FETCH,
  TEAM_2FA_SETTINGS_FETCH,
  TEAM_LOGO_UPDATE,
  TEAM_SETTINGS_UPDATE,
  TRANSFER_OWNERSHIP,
  UPDATE_TEAM
} from './team.actions'

export const initialTransferOwnershipState = {
  transferRequested: false,
  transferComplete: false,
  transferError: false
}

const initialTeamSettings: TeamSettings = {
  data: {
    allowLiveShare: false,
    approvedDomains: [],
    createdAt: '',
    defaultSpaces: '',
    enable2FA: false,
    enablePasswordComplexity: false,
    enablePasswordExpiration: false,
    enablePreventPasswordReuse: false,
    minimumPasswordLength: null,
    newMemberInvitations: false,
    passwordExpirationDays: null,
    rememberNumPasswords: 0,
    requireShareAuthentication: false,
    sessionInactivityTimeout: null,
    sessionTimeoutRequired: null,
    signupModeID: 0,
    teamID: '',
    teamLogins: [],
    updatedAt: '',
    userTestingPasswords: false
  },
  status: 'initial',
  isUpdating: false,
  isLoaded: false,
  isLoading: false,
  updateFailure: '',
  updateSuccess: false,
  isTeam2FAEnabled: false
}

export const initialState: TeamState = {
  data: {
    createdAt: '',
    creatorID: 0,
    id: '',
    logo: '',
    logoAssetKey: '',
    name: '',
    subdomain: window.location.host.split('.')[0],
    updatedAt: ''
  },
  deleteStatus: {
    deleteRequested: false,
    deleteSuccessful: false,
    isDeleting: false
  },
  isLoading: true,
  settings: initialTeamSettings,
  shareBranding: {},
  showPaywall: false,
  paywall: {},
  transferOwnership: initialTransferOwnershipState,
  updateStatus: {
    isUpdating: false
  }
}

const teamReducer: Reducer<TeamState> = (state = initialState, action): TeamState => {
  switch (action.type) {
    case CHECK_PAYWALL.SUCCESS: {
      const { paywall, hasPaywall } = action.payload
      return { ...state, showPaywall: hasPaywall, paywall }
    }

    case DELETE_TEAM.FAILURE: {
      return {
        ...state,
        deleteStatus: {
          isDeleting: false,
          deleteSuccessful: false,
          deleteRequested: true
        }
      }
    }
    case DELETE_TEAM.REQUEST: {
      return {
        ...state,
        deleteStatus: {
          isDeleting: true,
          deleteRequested: true,
          deleteSuccessful: false
        }
      }
    }
    case DELETE_TEAM.SUCCESS: {
      return {
        ...state,
        deleteStatus: {
          isDeleting: false,
          deleteSuccessful: true,
          deleteRequested: true
        }
      }
    }

    case FETCH_TEAM.FAILURE: {
      return {
        ...state,
        isLoading: false
      }
    }
    case FETCH_TEAM.REQUEST: {
      return {
        ...state,
        isLoading: true
      }
    }
    case FETCH_TEAM.SUCCESS: {
      return {
        ...state,
        data: action.payload,
        isLoading: false
      }
    }

    case SCIM_SETTINGS_FETCH.FAILURE: {
      return {
        ...state,
        settings: {
          ...state.settings,
          isSCIMEnabled: false
        }
      }
    }
    case SCIM_SETTINGS_FETCH.REQUEST: {
      return {
        ...state,
        settings: {
          ...state.settings,
          isSCIMEnabled: false
        }
      }
    }
    case SCIM_SETTINGS_FETCH.SUCCESS: {
      return {
        ...state,
        settings: {
          ...state.settings,
          isSCIMEnabled: action.payload?.enabled ?? false
        }
      }
    }

    case SET_TRANSFER_USER: {
      return {
        ...state,
        transferOwnership: {
          ...state.transferOwnership,
          transferOwnershipTo: action.payload.member
        }
      }
    }

    case SETTINGS_FETCH.FAILURE: {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
          isLoaded: false,
          isLoading: false,
          status: 'loaded'
        }
      }
    }
    case SETTINGS_FETCH.REQUEST: {
      return {
        ...state,
        settings: {
          ...state.settings,
          isLoaded: false,
          isLoading: true,
          status: 'loading'
        }
      }
    }
    case SETTINGS_FETCH.SUCCESS: {
      return {
        ...state,
        settings: {
          ...state.settings,
          data: action.payload,
          isLoaded: true,
          isLoading: false,
          status: 'loaded'
        }
      }
    }

    case SHARE_BRANDING_FETCH.SUCCESS: {
      return {
        ...state,
        shareBranding: {
          ...state.shareBranding,
          ...action.payload
        }
      }
    }

    case TEAM_2FA_SETTINGS_FETCH.FAILURE: {
      return {
        ...state,
        settings: {
          ...state.settings,
          isTeam2FAEnabled: false
        }
      }
    }
    case TEAM_2FA_SETTINGS_FETCH.REQUEST: {
      return {
        ...state,
        settings: {
          ...state.settings,
          isTeam2FAEnabled: false
        }
      }
    }
    case TEAM_2FA_SETTINGS_FETCH.SUCCESS: {
      return {
        ...state,
        settings: {
          ...state.settings,
          isTeam2FAEnabled: action.payload?.mfa_required ?? false
        }
      }
    }

    case TEAM_LOGO_UPDATE: {
      return {
        ...state,
        data: {
          ...state.data,
          logo: action.payload?.logo?.previewPutUrl
        }
      }
    }

    case TEAM_SETTINGS_UPDATE: {
      return {
        ...state,
        settings: {
          ...state.settings,
          data: {
            ...state.settings.data,
            ...action.payload
          }
        }
      }
    }

    case TRANSFER_OWNERSHIP.FAILURE: {
      return {
        ...state,
        transferOwnership: {
          ...state.transferOwnership,
          transferComplete: false,
          transferError: true,
          transferRequested: true
        }
      }
    }
    case TRANSFER_OWNERSHIP.REQUEST: {
      return {
        ...state,
        transferOwnership: {
          ...state.transferOwnership,
          transferComplete: false,
          transferError: false,
          transferRequested: true
        }
      }
    }
    case TRANSFER_OWNERSHIP.SUCCESS: {
      return {
        ...state,
        transferOwnership: {
          ...state.transferOwnership,
          transferComplete: true,
          transferError: false,
          transferRequested: true
        }
      }
    }

    case UPDATE_TEAM.FAILURE: {
      return {
        ...state,
        updateStatus: {
          isUpdating: false,
          updateFailure: action.payload.message
        }
      }
    }
    case UPDATE_TEAM.REQUEST: {
      return {
        ...state,
        updateStatus: {
          ...state.updateStatus,
          isUpdating: true
        }
      }
    }
    case UPDATE_TEAM.SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.data
        },
        updateStatus: {
          isUpdating: true
        }
      }
    }

    // Is triggered from the user store
    case USER_CLEAR_VALIDATION: {
      return {
        ...state,
        transferOwnership: {
          ...state.transferOwnership,
          ...initialTransferOwnershipState
        }
      }
    }

    default: {
      return state
    }
  }
}

export default teamReducer
