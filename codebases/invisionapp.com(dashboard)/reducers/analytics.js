import * as ActionTypes from '../constants/ActionTypes'
import { FILTER_DEFAULTS } from '../constants/FilterDefaults'

import normalizeAnalyticsDocumentType from '../utils/normalizeAnalyticsDocumentType'

export const initialState = {
  docCount: 0,
  document: {},
  documentType: 'unknown', // (prototype|board|freehand|rhombus)
  documentContext: 'unknown', // (recents|documents|spaces|space)
  filterType: FILTER_DEFAULTS.filters.type, // (all|boards|prototypes|freehands|rhombus),
  filterContext: 'unknown', // (mine|all|archived)
  space: {},
  spaceContext: 'unknown', // (plus|tile|share)
  spaceDocumentContext: 'unknown', // (tile|nav|share)
  homeView: 'unknown', // (/|/docs|/docs/all|/docs/archived|/spaces|/spaces/all)
  page: 0
}

export default function analyticsReducer (state = initialState, action) {
  const { type, data } = action
  switch (type) {
    case ActionTypes.API_GET_SPACE.SUCCESS:
      return setContext(state, {
        space: data.data
      })

    // View Actions
    case ActionTypes.ANALYTICS_SET_CONTEXT:
      return setContext(state, data)

    case ActionTypes.CREATE_MODAL_OPEN:
      // TODO - account for the other ways that open this modal,
      // the "Create a space" tile, for instance
      return setContext(state, { spaceContext: 'plus' })

    case ActionTypes.ANALYTICS_TRACK_CREATE_CLICK:
      return setContext(state, { documentType: normalizeAnalyticsDocumentType(data.documentType) })

    case ActionTypes.GOTO_PAGE:
      return setContext(state, { page: data.page })

    case ActionTypes.UPDATE_FILTERS:
      return setContext(state, { filterType: data.value, page: 0 })

    case ActionTypes.RESET_FILTERS:
      return setContext(state, { page: 0 })

    case ActionTypes.TOGGLE_MORE_MENU:
      return setContext(state, {
        spaceContext: 'tile',
        spaceDocumentContext: 'tile'
      })

    case ActionTypes.SET_VIEW_TYPE:
      // Determine if 'My Projects', 'All documents' or 'Archived' filter is selected
      let filterContext = 'mine'
      if (data.isTeam) {
        filterContext = 'all'
      } else if (data.isArchived) {
        filterContext = 'archived'
      }
      return setContext(state, { documentContext: data.type, filterContext, page: 0 })

    case ActionTypes.PAGE_OPENED:
      return setContext(state, { page: data.page, homeView: data.homeView })

    default:
      return state
  }
}

function setContext (state, data) {
  let returnData = Object.assign({}, data)

  if (returnData.documentType && returnData.documentType !== '') {
    returnData.documentType = normalizeAnalyticsDocumentType(returnData.documentType)
  }

  return Object.assign({}, state, returnData)
}
