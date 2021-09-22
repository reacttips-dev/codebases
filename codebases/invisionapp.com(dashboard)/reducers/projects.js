import update from 'immutability-helper'
import * as ActionTypes from '../constants/ActionTypes'
import createReducer, { cachedInitialState } from '../utils/create-reducer'

const reducerName = 'projects'

export const defaultKeys = {
  error: false,
  forceReload: false
}

export const cachedKeys = {
  isLoading: true,
  projects: {},
  projectsDetail: { isLoading: true, error: false },
  projectUpdates: []
}

const setLoadingProjectsDetail = (state) => ({
  projectsDetail: update(state.projectsDetail, {
    $merge: { ...state.projectsDetail, isLoading: true }
  })
})

const setLoadingProjectsDetailError = (state, error) => ({
  projectsDetail: update(state.projectsDetail, {
    $merge: { ...state.projectsDetail, error }
  })
})

const updateProjectsDetail = (state, response) => ({
  projectsDetail: update(state.projectsDetail, {
    $merge: { ...response.data, isLoading: false, fetchTime: response.fetchTime }
  })
})

const actionHandlers = {
  [ActionTypes.API_GET_PROJECTS.REQUEST]: (state) => update(state, {
    isLoading: { $set: true },
    error: { $set: false }
  }),
  [ActionTypes.API_GET_PROJECTS.SUCCESS]: (state, payload) => update(state, {
    error: { $set: false },
    isLoading: { $set: false },
    projects: { $merge: { [payload.spaceId]: payload.projects } }
  }),
  [ActionTypes.API_GET_PROJECTS_DETAIL.REQUEST]: setLoadingProjectsDetail,
  [ActionTypes.API_GET_PROJECTS_DETAIL.SUCCESS]: updateProjectsDetail,
  [ActionTypes.API_GET_PROJECTS_DETAIL.ERROR]: setLoadingProjectsDetailError,

  [ActionTypes.API_UPDATE_PROJECT_SIDEBAR.REQUEST]: () => ({ forceReload: false }),
  [ActionTypes.API_UPDATE_PROJECT_SIDEBAR.SUCCESS]: () => ({ forceReload: true }),
  [ActionTypes.API_DELETE_PROJECT.REQUEST]: () => ({ forceReload: false }),
  [ActionTypes.API_DELETE_PROJECT.SUCCESS]: () => ({ forceReload: true })
}

export default createReducer(
  cachedInitialState(reducerName, defaultKeys, cachedKeys),
  actionHandlers,
  reducerName,
  Object.keys(cachedKeys)
)
