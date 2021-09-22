import update from 'immutability-helper'

import * as ActionTypes from '../constants/ActionTypes'
import createReducer, { cachedInitialState } from '../utils/create-reducer'

const reducerName = 'spaces'

export const defaultKeys = {
  error: null,
  fromCache: true,
  isDeleting: false
}

export const cachedKeys = {
  isLoading: true,
  spaces: [],
  permissions: {
    canCreate: false
  },
  spacesResource: { isLoading: true, spaces: [], cursor: '' },
  spacesDetail: { isLoading: true },
  spacesMembers: { isLoading: true },
  spacesPermissions: { isLoading: true },
  spacesSearchResource: { isLoading: true, spaces: [], cursor: '' },
  userId: ''
}

const deleteSpace = (state, data) => {
  const { cuid, pagingEnabled, enableSpacesIndexPagination } = data
  const idx = state.spaces.findIndex(s => s.cuid === cuid)

  if (pagingEnabled || enableSpacesIndexPagination) {
    return {
      spacesDetail: update(state.spacesDetail, { '$unset': [cuid] }),
      spacesPermissions: update(state.spacesPermissions, { '$unset': [cuid] }),
      spacesMembers: update(state.spacesMembers, { '$unset': [cuid] }),
      isDeleting: false,
      spaces: (idx > -1) ? update(state.spaces, { '$splice': [[idx, 1]] }) : state.spaces
    }
  }

  if (idx === -1) {
    return {
      isDeleting: false
    }
  }

  return {
    isDeleting: false,
    spaces: update(state.spaces, {
      '$splice': [[idx, 1]]
    })
  }
}

const clearRetainedData = (state, { spaceId }) => ({
  spacesDetail: update(state.spacesDetail, { '$unset': [spaceId] }),
  spacesPermissions: update(state.spacesPermissions, { '$unset': [spaceId] }),
  spacesMembers: update(state.spacesMembers, { '$unset': [spaceId] })
})

const leaveSpace = (state, data) => {
  const { cuid, pagingEnabled, enableSpacesIndexPagination } = data

  const idx = state.spaces.findIndex(s => s.cuid === cuid)
  const space = idx > -1 ? state.spaces[idx] : {}
  const memberIdx = idx > -1 ? space.data.members.findIndex(m => m.userId === state.userId) : 0

  if ((pagingEnabled && !enableSpacesIndexPagination) || enableSpacesIndexPagination) {
    return {
      spacesDetail: update(state.spacesDetail, { '$unset': [cuid] }),
      spacesPermissions: update(state.spacesPermissions, { '$unset': [cuid] }),
      spacesMembers: update(state.spacesMembers, { '$unset': [cuid] }),
      spaces: idx > -1 ? update(state.spaces, {
        [idx]: {
          data: {
            members: {
              '$splice': [[memberIdx, 1]]
            }
          }
        }
      }) : state.spaces
    }
  }

  if (idx >= 0) {
    if (space.data.isPublic) {
      if (memberIdx >= 0) {
        return {
          spaces: update(state.spaces, {
            [idx]: {
              data: {
                members: {
                  '$splice': [[memberIdx, 1]]
                }
              }
            }
          })
        }
      }
    } else {
      // If the space is private, we can safely "delete" it
      // to remove it from the main listing
      return deleteSpace(state, data)
    }
  }
}

const updateSpace = (state, cuid, data) => {
  const idx = state.spaces.findIndex(s => s.cuid === cuid)

  if (idx === -1) {
    return
  }

  return {
    spaces: update(state.spaces, {
      [idx]: {
        data
      }
    })
  }
}

const updateSpaceTitle = (state, { data }) => {
  return updateSpace(
    state,
    data.cuid, {
      title: { '$set': data.title }
    })
}

const updateLoadedSpace = (state, { data }) => {
  return updateSpace(
    state,
    data.cuid, {
      lastViewed: { '$set': new Date().toISOString() },
      members: { '$set': data.members }
    })
}

const updateSpaceVisibility = (state, { response: { data } }) => {
  return updateSpace(
    state,
    data.cuid, {
      isPublic: { '$set': data.visibility === 'team' }
    })
}

const updateSpacesResource = (state, response) => {
  const { resources, reset, pagination, fetchTime, pageSize, metadataFetched } = response
  return {
    spacesResource: {
      spaces: (reset === true)
        ? update(state.spacesResource.spaces, { $set: resources })
        : update(state.spacesResource.spaces, { $push: resources }),
      isLoading: false,
      cursor: pagination.cursor,
      page: pagination.page,
      frameCount: resources.length,
      metadataFetched,
      fetchTime,
      pageSize
    }
  }
}

const updateSpacesSearchResource = (state, response) => {
  const { resources, reset, pagination, fetchTime, pageSize, metadataFetched } = response

  return {
    spacesSearchResource: {
      spaces: (reset === true)
        ? update(state.spacesSearchResource.spaces, { $set: resources })
        : update(state.spacesSearchResource.spaces, { $push: resources }),
      isLoading: update(state.spacesSearchResource.isLoading, { '$set': false }),
      cursor: pagination.cursor,
      page: pagination.page,
      frameCount: resources.length,
      metadataFetched,
      fetchTime,
      pageSize
    }
  }
}

const updateSpacesDetail = (state, response) => ({
  spacesDetail: update(state.spacesDetail, {
    $merge: { ...response.data, isLoading: false, fetchTime: response.fetchTime }
  }),
  spacesPermissions: update(state.spacesPermissions, {
    $merge: { ...response.permissions, isLoading: false }
  })
})

const updateSpaceMemberDetail = (state, response) => ({
  spacesMembers: update(state.spacesMembers, {
    $merge: { [response.id]: response.data, isLoading: false, fetchTime: response.fetchTime }
  })
})

const setLoadingSpacesResource = (state) => {
  return {
    spacesResource: {
      ...state.spacesResource,
      isLoading: true
    }
  }
}

const setLoadingSpacesSearchResource = (state) => {
  return {
    spacesSearchResource: {
      isLoading: update(state.spacesSearchResource.isLoading, { '$set': true }),
      spaces: update(state.spacesSearchResource.spaces, { '$set': state.spacesSearchResource.spaces }),
      cursor: ''
    }
  }
}

const setLoadingSpacesDetail = (state) => ({
  spacesDetail: { ...state.spacesDetail, isLoading: true },
  spacesPermissions: { ...state.spacesPermissions, isLoading: true }
})

const setLoadingSpacesMemberDetails = (state) => ({
  spacesMembers: { ...state.spacesMembers, isLoading: true }
})

// Sidebar uses global nav to create spaces, which returns new space data inconsistently from home-web
// It therefore needs to a special handler.
const createSpaceFromSidebar = (state, data) => {
  const { spaces } = state
  const idx = spaces.findIndex(s => s.cuid === data.cuid)

  if (idx !== -1) {
    return spaces
  }

  if (!data.documents) {
    data.documents = []
  }

  const now = new Date().toISOString()
  return {
    spaces: update(spaces, {
      '$push': [{
        cuid: data.cuid,
        data: {
          ...data,
          createdAt: now,
          updatedAt: now
        },
        id: data.id,
        permissions: {
          canActivate: true,
          canArchive: true,
          canDelete: true,
          canDuplicate: true,
          canEdit: true,
          canJoin: true,
          canShare: true,
          canView: true,
          hasMembership: true,
          owns: true
        },
        type: 'space'
      }]
    })
  }
}

const createSpace = (state, newSpaceData) => {
  const { data, permissions } = newSpaceData
  const idx = state.spaces.findIndex(s => s.cuid === data.cuid)
  let payload = data

  if (payload.data) {
    payload = payload.data
  }

  if (idx !== -1 || typeof payload === 'undefined') {
    return
  }

  return {
    spaces: update(state.spaces, {
      '$push': [{
        cuid: payload.cuid,
        data,
        id: payload.id,
        permissions,
        type: 'space'
      }]
    })
  }
}

const actionHandlers = {
  [ActionTypes.API_GET_CONFIG.SUCCESS]: (_, data) => ({
    userId: data.userID
  }),

  [ActionTypes.API_CREATE_SPACE.SUCCESS]: createSpace,
  [ActionTypes.API_CREATE_SPACE_FROM_SIDEBAR.SUCCESS]: createSpaceFromSidebar,
  [ActionTypes.API_DELETE_SPACE.SUCCESS]: deleteSpace,
  [ActionTypes.API_LEAVE_SPACE.SUCCESS]: leaveSpace,
  [ActionTypes.API_UPDATE_SPACE.SUCCESS]: updateSpaceTitle,
  [ActionTypes.API_GET_SPACES_RESOURCE.REQUEST]: setLoadingSpacesResource,
  [ActionTypes.API_GET_SPACES_RESOURCE.SUCCESS]: updateSpacesResource,
  [ActionTypes.API_GET_SPACES_SEARCH_RESOURCE.REQUEST]: setLoadingSpacesSearchResource,
  [ActionTypes.SET_SPACES_SEARCH_RESOURCE_LOADING]: setLoadingSpacesSearchResource,
  [ActionTypes.API_GET_SPACES_SEARCH_RESOURCE.SUCCESS]: updateSpacesSearchResource,
  [ActionTypes.API_GET_SPACES_DETAIL.REQUEST]: setLoadingSpacesDetail,
  [ActionTypes.API_GET_SPACE_MEMBERS_DETAIL.REQUEST]: setLoadingSpacesMemberDetails,
  [ActionTypes.API_GET_SPACES_DETAIL.SUCCESS]: updateSpacesDetail,
  [ActionTypes.API_GET_SPACE_MEMBERS_DETAIL.SUCCESS]: updateSpaceMemberDetail,
  [ActionTypes.API_GET_SPACE.SUCCESS]: updateLoadedSpace,
  [ActionTypes.API_GET_SPACE_V2.REQUEST]: clearRetainedData,
  [ActionTypes.UPDATE_ACCESS_MANAGEMENT]: updateSpaceVisibility,
  [ActionTypes.SHOW_PROJECTS_IN_SPACE]: (state, data) => {
    const { index, isOpen } = data
    return {
      spacesResource: update(state.spacesResource, {
        spaces: {
          [index]: {
            isOpen: { $set: isOpen }
          }
        }
      })
    }
  }

}

export default createReducer(
  cachedInitialState(reducerName, defaultKeys, cachedKeys),
  actionHandlers,
  reducerName,
  Object.keys(cachedKeys)
)
