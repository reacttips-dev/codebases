import * as ActionTypes from '../constants/ActionTypes'

import { DEFAULT_FILTER_TYPE } from '../constants/FilterTypes'
import {
  DOCUMENTS_SORTS,
  SPACES_SORTS,
  DOCUMENTS_DEFAULT_SORT,
  SPACES_DEFAULT_SORT,
  SORT_CREATED,
  SORT_UPDATED,
  SORT_ALPHA
} from '../constants/SortTypes'

import createReducer from '../utils/create-reducer'
import getCookie from '../utils/getCookie'

export function getCachedSorts () {
  try {
    const sorts = window.localStorage.getItem('home-sorts')

    if (sorts) {
      let returnSorts = JSON.parse(sorts)

      const documentsSortCookie = getCookie('inv-home-docs-sortby')
      if (documentsSortCookie && ['createdAt', 'updatedAt', 'title'].indexOf(documentsSortCookie) >= 0) {
        if (documentsSortCookie === 'createdAt') returnSorts.documentsSort = SORT_CREATED
        if (documentsSortCookie === 'updatedAt') returnSorts.documentsSort = SORT_UPDATED
        if (documentsSortCookie === 'title') returnSorts.documentsSort = SORT_ALPHA
      }

      return returnSorts
    } else {
      return {}
    }
  } catch (e) {
    return {}
  }
}

export function setCachedSort (type, value) {
  try {
    let sorts = {}

    const val = window.localStorage.getItem('home-sorts')
    if (val) {
      sorts = JSON.parse(val)
    }

    sorts[type] = value

    window.localStorage.setItem('home-sorts', JSON.stringify(sorts))
  } catch (e) {}
}

const cachedValue = (cache, type) => {
  const defaultValue = type === 'spacesSort' ? SPACES_DEFAULT_SORT : DOCUMENTS_DEFAULT_SORT
  const sortTypes = type === 'spacesSort' ? SPACES_SORTS : DOCUMENTS_SORTS

  if (cache[type]) {
    if (sortTypes.indexOf(cache[type]) >= 0) {
      return cache[type]
    }
  }

  return defaultValue
}

export const initialState = () => {
  const cache = getCachedSorts()

  return {
    documentType: DEFAULT_FILTER_TYPE,
    search: '',
    documentsSort: cachedValue(cache, 'documentsSort'),
    showFilters: true,
    showGetInspired: true,
    spacesSort: cachedValue(cache, 'spacesSort'),
    viewFilter: 'team',
    viewType: 'documents',
    searchView: 'documents',
    projectId: '',
    spaceId: '',
    isArchived: false
  }
}

const updateFilters = (state, data) => {
  const { type, value } = data

  switch (type) {
    case 'searchTerm':
      return { search: value }

    case 'documentsSort':
      const documentsSort = DOCUMENTS_SORTS.find(s => value === s) || DOCUMENTS_DEFAULT_SORT
      setCachedSort('documentsSort', documentsSort)
      return { documentsSort }

    case 'spacesSort':
      const spacesSort = SPACES_SORTS.find(s => s === value) || SPACES_DEFAULT_SORT
      setCachedSort('spacesSort', spacesSort)
      return { spacesSort }

    case 'type':
      return { documentType: value }

    case 'searchView':
      return { searchView: value }

    case 'projectId':
      return { projectId: value }

    case 'spaceId':
      return { spaceId: value }

    case 'viewType':
      return { viewType: value }

    case 'isArchived':
      return { isArchived: value }

    default:
      return null
  }
}

const actionHandlers = {
  [ ActionTypes.LOAD_STORED_SORTS ]: () => {
    const cache = getCachedSorts()
    return {
      documentsSort: cachedValue(cache, 'documentsSort'),
      spacesSort: cachedValue(cache, 'spacesSort')
    }
  },

  [ ActionTypes.SET_VIEW_TYPE ]: (state, { type, isTeam, isArchived }) => {
    return {
      viewType: type,
      viewFilter: isArchived ? 'archive' : isTeam ? 'team' : 'user'
    }
  },

  [ ActionTypes.RESET_FILTERS ]: () => ({
    documentType: initialState().documentType,
    search: initialState().search,
    searchView: initialState().searchView,
    projectId: initialState().projectId,
    spaceId: initialState().spaceId,
    viewType: initialState().viewType,
    isArchived: initialState().isArchived
  }),

  [ ActionTypes.SET_SHOW_FILTERS ]: (_, data) => ({
    showFilters: data
  }),

  [ ActionTypes.SET_SHOW_GET_INSPIRED ]: (_, data) => ({
    showGetInspired: data
  }),

  [ ActionTypes.UPDATE_FILTERS ]: updateFilters
}

export default createReducer(initialState(), actionHandlers)
