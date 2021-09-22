import update from 'immutability-helper'

import createReducer, { cachedInitialState } from '../utils/create-reducer'
import { GenerateIDURL } from '../utils/urlIDParser'

import * as ActionTypes from '../constants/ActionTypes'
import { DESCRIPTION_CHARACTER_LIMIT } from '../constants/DescriptionConstants'
import { navigate } from '../utils/navigation'

export const reducerName = 'space'

export const defaultKeys = {
  fromCache: true,
  isDescriptionEditing: false,
  isDescriptionSaving: false,
  isLoadingFull: true,
  manageAccessModalOpen: false,
  error: {},
  forceReload: false,
  reloadDocuments: false
}

export const cachedKeys = {
  id: null,
  cuid: null,
  description: null,
  documentCount: null,
  hasProjects: false,
  isLoading: true,
  members: [],
  title: null,
  isPublic: false,
  permissions: {
    addDocuments: false,
    deleteSpace: false,
    editSpace: false,
    leaveSpace: false
  },
  projectCount: 0
}

const setWindowTitle = (title) => {
  document.title = `${title} - InVision`
}

const selectSpace = (state, data) => {
  const { id, title, isPublic } = data
  setTimeout(() => {
    navigate(`/spaces/${GenerateIDURL(id, title)}`)
  })

  return {
    id,
    cuid: id,
    title,
    isPublic
  }
}

const requestSpaceLoad = (state, data) => {
  const cuid = data.spaceId ? data.spaceId : data.cuid
  const freshLoad = state.id && cuid !== state.id

  return freshLoad ? {
    ...defaultKeys,
    ...cachedKeys,
    id: cuid,
    cuid: cuid
  } : {
    ...defaultKeys,
    id: cuid,
    cuid: cuid
  }
}

const loadSpace = (_, payload) => {
  const { data, pagingEnabled, permissions } = payload

  const permissionValue = (permissionObj, permission) => permissionObj ? (permissionObj[permission] || false) : false

  let addDocuments, deleteSpace, editSpace, leaveSpace

  if (pagingEnabled) {
    addDocuments = permissionValue(permissions, 'addDocuments')
    deleteSpace = permissionValue(permissions, 'deleteSpace')
    editSpace = permissionValue(permissions, 'editSpace')
    leaveSpace = permissionValue(permissions, 'leaveSpace')
  } else {
    addDocuments = permissionValue(data.permissions, 'addDocuments')
    deleteSpace = permissionValue(data.permissions, 'deleteSpace')
    editSpace = permissionValue(data.permissions, 'addDocuments')
    leaveSpace = permissionValue(data.permissions, 'leaveSpace')
  }

  setWindowTitle(data.title)
  return {
    isLoading: false,
    isLoadingFull: false,
    fromCache: false,
    forceReload: false,
    id: data.id,
    cuid: data.cuid,
    description: data.description.substring(0, DESCRIPTION_CHARACTER_LIMIT),
    documentCount: data.documentCount,
    members: data.members,
    title: data.title,
    isPublic: data.isPublic,
    permissions: {
      addDocuments,
      deleteSpace,
      editSpace,
      leaveSpace
    },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }
}

const setSpaceHasProjects = (state, data) => {
  if (data.spaceId === state.id) {
    return {
      hasProjects: data.projects && data.projects.length > 0
    }
  }
}

const updateSpace = (state, response) => {
  if (response.data.title !== state.title) {
    setTimeout(() => {
      navigate(`/spaces/${GenerateIDURL(response.data.id, response.data.title)}`, { replace: true })
    })
    setWindowTitle(response.data.title)
  }

  let obj = {
    isLoading: false
  }

  if (typeof response.data.cuid !== 'undefined') {
    obj.cuid = response.data.cuid
  }

  if (typeof response.data.description !== 'undefined') {
    obj.description = response.data.description
  }

  if (typeof response.data.documentCount !== 'undefined') {
    obj.documentCount = response.data.documentCount
  }

  if (typeof response.data.title !== 'undefined') {
    obj.title = response.data.title
  }

  if (typeof response.data.isPublic !== 'undefined') {
    obj.isPublic = response.data.isPublic
  }

  if (typeof response.data.updatedAt !== 'undefined') {
    obj.updatedAt = response.data.updatedAt
  }

  return update(state, {
    $merge: obj
  })
}

const redirectHome = () => {
  setTimeout(() => { navigate('/') })
  return {
    ...defaultKeys,
    ...cachedKeys
  }
}

const clearCache = () => {
  return {
    ...defaultKeys,
    ...cachedKeys
  }
}

const actionHandlers = {
  // Server actions
  [ActionTypes.API_GET_SPACE.REQUEST]: requestSpaceLoad,
  [ActionTypes.API_GET_SPACE_V2.REQUEST]: requestSpaceLoad,
  [ActionTypes.API_GET_SPACE.SUCCESS]: loadSpace,
  [ActionTypes.API_GET_SPACE_V2.SUCCESS]: loadSpace,
  [ActionTypes.API_GET_SPACE.FAILURE]: redirectHome,
  [ActionTypes.API_GET_SPACE_V2.FAILURE]: redirectHome,
  [ActionTypes.API_GET_PROJECTS.SUCCESS]: setSpaceHasProjects,

  [ActionTypes.API_ADD_DOCUMENTS_TO_SPACE.REQUEST]: () => ({
    reloadDocuments: false
  }),

  [ActionTypes.API_ADD_DOCUMENTS_TO_SPACE.SUCCESS]: () => ({
    reloadDocuments: true
  }),

  [ActionTypes.API_MOVE_DOCUMENTS_TO_PROJECT.SUCCESS]: (state) => ({
    reloadDocuments: !state.reloadDocuments
  }),

  [ActionTypes.API_MOVE_DOCUMENTS_TO_CONTAINER.REQUEST]: () => ({
    reloadDocuments: false
  }),

  [ActionTypes.API_MOVE_DOCUMENTS_TO_CONTAINER.SUCCESS]: () => ({
    reloadDocuments: true
  }),

  [ActionTypes.SELECT_SPACE]: selectSpace,

  [ActionTypes.START_DESCRIPTION_EDIT]: () => ({
    isDescriptionEditing: true
  }),
  [ActionTypes.STOP_DESCRIPTION_EDIT]: () => ({
    isDescriptionEditing: false
  }),
  [ActionTypes.API_UPDATE_DESCRIPTION.REQUEST]: () => ({
    isDescriptionSaving: true
  }),
  [ActionTypes.API_UPDATE_DESCRIPTION.SUCCESS]: (state, payload) => Object.assign(updateSpace(state, payload), {
    isDescriptionEditing: false,
    isDescriptionSaving: false
  }),
  [ActionTypes.API_UPDATE_DESCRIPTION.FAILURE]: () => ({
    isDescriptionSaving: false
  }),

  [ActionTypes.API_UPDATE_SPACE.SUCCESS]: updateSpace,

  [ActionTypes.API_DELETE_SPACE.SUCCESS]: clearCache,

  [ActionTypes.API_LEAVE_SPACE.SUCCESS]: clearCache,

  [ActionTypes.API_DELETE_PROJECT.SUCCESS]: (state, data) => ({
    hasProjects: state.projectCount > 1,
    projectCount: state.projectCount - 1
  }),

  [ActionTypes.OPEN_MANAGE_ACCESS_MODAL]: (_, isOpen) => ({
    manageAccessModalOpen: isOpen
  }),

  [ActionTypes.RESET_SPACE]: clearCache,

  [ActionTypes.UPDATE_ACCESS_MANAGEMENT]: (_, payload) => ({
    isPublic: payload.response.data.visibility === 'team'
  }),

  [ActionTypes.SET_PROJECT_COUNT]: (_, count) => ({
    projectCount: count
  })
}

export default createReducer(
  cachedInitialState(reducerName, defaultKeys, cachedKeys),
  actionHandlers,
  reducerName,
  Object.keys(cachedKeys)
)
