const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

function createAsyncActions (base) {
  const res = {};
  [REQUEST, SUCCESS, FAILURE].forEach(type => { res[type] = `${base}_${type}` })
  return res
}

// Server Actions
export const API_CREATE_PROJECT = createAsyncActions('CREATE_PROJECT')
export const API_CREATE_SPACE = createAsyncActions('CREATE_SPACE')
export const API_DELETE_PROJECT = createAsyncActions('DELETE_PROJECT')
export const API_DELETE_PROJECT_SIDEBAR = createAsyncActions('DELETE_PROJECT_SIDEBAR')
export const API_DELETE_SPACE = createAsyncActions('DELETE_SPACE')
export const API_GET_ACCOUNT = createAsyncActions('API_GET_ACCOUNT')
export const API_GET_CONFIG = createAsyncActions('API_GET_CONFIG')
export const API_GET_MY_SPACES = createAsyncActions('API_GET_MY_SPACES')
export const API_GET_PERMISSIONS = createAsyncActions('API_GET_PERMISSIONS')
export const API_GET_PROJECT_SIDEBAR = createAsyncActions('GET_PROJECT_SIDEBAR')
export const API_GET_PROJECTS = createAsyncActions('API_GET_PROJECTS')
export const API_GET_SPACE = createAsyncActions('GET_SPACE')
export const API_GET_SPACE_V2 = createAsyncActions('GET_SPACE_V2')
export const API_GET_SPACE_RESOURCES = createAsyncActions('API_GET_SPACE_RESOURCES')
export const API_LEAVE_SPACE = createAsyncActions('LEAVE_SPACE')
export const API_LIST_SPACES = createAsyncActions('LIST_SPACES')
export const API_MOVE_DOCUMENTS_TO_SPACE = createAsyncActions('MOVE_DOCUMENTS_TO_SPACE')
export const API_MOVE_DOCUMENTS_TO_PROJECT = createAsyncActions('MOVE_DOCUMENTS_TO_PROJECT')
export const API_UPDATE_PROJECT = createAsyncActions('UPDATE_PROJECT')
export const API_UPDATE_PROJECT_SIDEBAR = createAsyncActions('UPDATE_PROJECT_SIDEBAR')
export const API_UPDATE_SPACE = createAsyncActions('UPDATE_SPACE')
export const API_GET_SUBSCRIPTION = createAsyncActions('GET_SUBSCRIPTION')

// Spaces Actions
export const JOINED_SPACE = 'JOINED_SPACE'
export const NAVIGATE_TO_SPACE = 'NAVIGATE_TO_SPACE'
export const SIDEBAR_SPACE_CREATED = 'SIDEBAR_SPACE_CREATED'
export const SHOW_PROJECTS_IN_SPACE = 'SHOW_PROJECTS_IN_SPACE'
export const UPDATE_ACCESS_MANAGEMENT = 'UPDATE_ACCESS_MANAGEMENT'
export const UPDATE_SPACE_HAS_CONTAINER = 'UPDATE_SPACE_HAS_CONTAINER'

// View Actions
export const LINK_CLICKED = 'LINK_CLICKED'
export const SET_CONDENSED_STATE = 'SET_CONDENSED_STATE'
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
export const TOGGLE_CONDENSED_SIDEBAR = 'TOGGLE_CONDENSED_SIDEBAR'
export const TOGGLE_TEAM_SETTINGS = 'TOGGLE_TEAM_SETTINGS'
export const TRACK_EVENT = 'TRACK_EVENT'

// Modal Actions
export const CLOSE_MODAL = 'CLOSE_MODAL'
export const SHOW_MODAL = 'SHOW_MODAL'

// Drop to sidebar
export const END_DOCUMENT_DRAG = 'END_DOCUMENT_DRAG'
export const START_DOCUMENT_DRAG = 'START_DOCUMENT_DRAG'

// Global Navigation Actions
export const GN_API_CREATE_SPACE = createAsyncActions('GN_API_CREATE_SPACE')

// External Actions - from Home UI
export const SIDEBAR_EXPAND_SPACE = 'SIDEBAR_EXPAND_SPACE'
