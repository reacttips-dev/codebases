import update from 'immutability-helper'

import createReducer, { cachedInitialState } from '../utils/create-reducer'
import { GenerateIDURL } from '../utils/urlIDParser'

import * as ActionTypes from '../constants/ActionTypes'
import { navigate } from '../utils/navigation'

export const reducerName = 'project'

export const defaultKeys = {
  fromCache: true,
  isDescriptionEditing: false,
  isDescriptionSaving: false,
  isLoadingFull: true,
  error: {}
}

export const cachedKeys = {
  id: '',
  description: '',
  isLoading: true,
  overviewPageId: '',
  spaceId: '',
  spaceName: '',
  spaceUrl: '',
  shape: 0,
  color: '#ffffff',
  title: '',
  permissions: {
    edit: false
  }
}

const setWindowTitle = (title) => {
  document.title = `${title} - InVision`
}

const resetProjectTitle = (id, title) => {
  setTimeout(() => {
    navigate(`/projects/${GenerateIDURL(id, title)}`, { replace: true })
  })

  setWindowTitle(title)
}

const actionHandlers = {
  // Server actions
  [ActionTypes.API_GET_PROJECT.REQUEST]: (state, data) => {
    const freshLoad = state.id && data.projectId !== state.id

    return freshLoad ? {
      ...defaultKeys,
      ...cachedKeys,
      id: data.projectId
    } : {
      ...defaultKeys,
      id: data.projectId
    }
  },

  [ActionTypes.API_GET_PROJECT.SUCCESS]: (state, response) => {
    setWindowTitle(response.project.title)

    return update(state, {
      $merge: {
        isLoading: false,
        isLoadingFull: false,
        id: response.project.id,
        description: response.project.description,
        overviewPageId: response.project.overviewPageId,
        spaceName: response.space.title,
        spaceId: response.space.id,
        spaceUrl: `/spaces/${GenerateIDURL(response.space.id, response.space.title)}`,
        title: response.project.title,
        shape: response.project.shape,
        color: response.project.color,
        permissions: {
          edit: response.space.permissions.editSpace
        }
      }
    })
  },

  [ActionTypes.API_GET_PROJECT.FAILURE]: (state) => {
    redirectBack(state.spaceUrl)
  },

  [ActionTypes.API_GET_SPACE_V2.SUCCESS]: (_, space) => ({
    spaceName: space.data.title,
    spaceUrl: `/spaces/${GenerateIDURL(space.data.id, space.data.title)}`,
    permissions: {
      edit: space.permissions.editSpace
    }
  }),

  [ActionTypes.API_DELETE_PROJECT.SUCCESS]: (state) => {
    if (state.spaceUrl && window.location.pathname !== `${state.spaceUrl}/projects`) {
      setTimeout(redirectBack(`${state.spaceUrl}/projects`), 250)
    }

    return {
      ...defaultKeys,
      ...cachedKeys
    }
  },

  [ActionTypes.API_UPDATE_PROJECT.REQUEST]: () => ({
    isDescriptionSaving: true
  }),

  [ActionTypes.API_UPDATE_PROJECT_SIDEBAR.SUCCESS]: (state, data) => {
    if (data.projectId === state.id) {
      if (data.title && data.title !== state.title) {
        resetProjectTitle(state.id, data.title)
      }

      return {
        isLoading: false,
        title: data.title || state.title,
        description: data.description
      }
    }
  },

  [ActionTypes.API_UPDATE_PROJECT.SUCCESS]: (state, data) => {
    if (data.title) {
      resetProjectTitle(state.id, data.title)
    }

    return {
      isLoading: false,
      isDescriptionEditing: false,
      isDescriptionSaving: false,
      title: data.title || state.title,
      description: data.hasOwnProperty('description') ? data.description : state.description
    }
  },

  [ActionTypes.API_UPDATE_PROJECT.FAILURE]: () => ({
    isDescriptionSaving: false
  }),

  [ActionTypes.API_MOVE_DOCUMENTS_TO_CONTAINER.REQUEST]: () => ({
    reloadDocuments: false
  }),

  [ActionTypes.API_MOVE_DOCUMENTS_TO_CONTAINER.SUCCESS]: () => ({
    reloadDocuments: true
  }),

  [ActionTypes.START_DESCRIPTION_EDIT]: () => ({
    isDescriptionEditing: true
  }),

  [ActionTypes.STOP_DESCRIPTION_EDIT]: () => ({
    isDescriptionEditing: false
  })
}

const redirectBack = spaceUrl => {
  const redirectTo = spaceUrl || '/'
  setTimeout(() => { navigate(redirectTo) })
  return {
    ...defaultKeys,
    ...cachedKeys
  }
}

export default createReducer(
  cachedInitialState(reducerName, defaultKeys, cachedKeys),
  actionHandlers,
  reducerName,
  Object.keys(cachedKeys)
)
