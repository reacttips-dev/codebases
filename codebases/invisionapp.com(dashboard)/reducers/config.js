// Action Types
import * as ActionTypes from '../constants/ActionTypes'

export const initialState = () => ({
  bulkMoveEnabled: false,
  cacheReducers: true,
  defaultTabNavigation: false,
  dragDropEnabled: false,
  enableSpacesIndexPagination: false,
  cloudflareEnabled: false,
  isLoading: true,
  loadFailed: false,
  onboardingEnabled: false,
  osType: '',
  pagingEnabled: true,
  rhombusEnabled: false,
  spaceProjectsEnabled: false,
  showMobileWarning: false,
  sidebarTeamsEnabled: false,
  specsEnabled: false,
  specsGaRelease: false,
  showGetInspiredSpecsAd: false,
  studioWebEnabled: false,
  teamDocsInHome: false,
  teamID: ''
})

export default function configReducer (state = initialState(), action) {
  var { type, data } = action

  switch (type) {
    case ActionTypes.API_GET_CONFIG.SUCCESS:
      return getDConfigSuccess(state, data)

    case ActionTypes.API_GET_CONFIG.FAILURE:
      return getDConfigFailure(data)

    case ActionTypes.SET_BROWSER_INFO:
      return setMobileWarningInfo(state, data)

    default:
      return state
  }
}

function getDConfigSuccess (state, response) {
  return Object.assign({}, state,
    {
      isLoading: false,
      loadFailed: false
    },
    { ...response }
  )
}

function getDConfigFailure (data) {
  return Object.assign({}, initialState, {
    isLoading: false,
    loadFailed: true,
    authError: data.authError
  })
}

function setMobileWarningInfo (state, data) {
  const { osType, showMobileWarning } = data
  return Object.assign({}, state, {
    osType,
    showMobileWarning
  })
}
