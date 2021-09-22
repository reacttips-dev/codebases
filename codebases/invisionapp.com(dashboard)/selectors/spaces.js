import { createSelector } from 'reselect'
import cloneDeep from 'lodash/cloneDeep'
import sortBy from 'lodash/sortBy'

import sortMembersAvatars from '../utils/avatars'

import * as SortTypes from '../constants/SortTypes'

const getCloudflareEnabled = state => state.config.cloudflareEnabled
const getDocuments = state => state.documents.documents
const getSearch = state => state.filters.search
const getSortType = state => state.filters.spacesSort
const getSpaces = state => state.spaces.spaces
const getTeamId = state => state.config.teamID
const getViewFilter = state => state.filters.viewFilter

export const filterSpaces = createSelector(
  getSpaces,
  getSearch,
  getSortType,
  getTeamId,
  getViewFilter,
  getCloudflareEnabled,
  (originalSpaces, search, sortType, teamId, viewFilter, cloudflareEnabled) => {
    let spaces = cloneDeep(originalSpaces)
    spaces.forEach(space => {
      space.data.members = sortMembersAvatars(space.data.members, cloudflareEnabled)
    })

    // Team/User filtering
    if (viewFilter === 'team') {
      spaces = spaces.filter(space => {
        return space.data.teamId === teamId
      })
    } else {
      spaces = spaces.filter(space => space.permissions && space.permissions.owns)
    }

    // Keyword search
    if (search) {
      const lowerSearch = search.toLowerCase()
      spaces = spaces.filter(space => space.data.title.toLowerCase().indexOf(lowerSearch) >= 0)
    }

    // Sorting
    switch (sortType) {
      case SortTypes.SORT_DOC_COUNT:
        spaces = sortBy(spaces, space => space.data.title.toLowerCase()).reverse()
        spaces = sortBy(spaces, space => space.data.documents ? space.data.documents.length : 0).reverse()
        break
      case SortTypes.SORT_ALPHA:
        spaces = sortBy(spaces, space => space.data.title.toLowerCase())
        break
      case SortTypes.SORT_RECENT:
      default:
        spaces = spaces.sort((a, b) => {
          // If a has a lastViewed, but b doesn't, return -1
          if (a.data.lastViewed && !b.data.lastViewed) {
            return -1
          } else if (b.data.lastViewed && !a.data.lastViewed) {
            // If a does not have a lastViewed, but b does, return 1
            return 1
          } else if (a.data.lastViewed && b.data.lastViewed) {
            // If a has a lastViewed, and b has a lastViewed, return the most recent
            return a.data.lastViewed > b.data.lastViewed ? -1 : 1
          }
          // IF a does not have a lastViewed and b does not have a lastViewed, return most recent updatedAt

          return a.data.updatedAt > b.data.updatedAt ? -1 : 1
        })
        break
    }

    return spaces
  }
)

export const spaceDocuments = createSelector(
  getSpaces,
  getDocuments,
  (spaces, documents) => {
    let spaceDocuments = {}

    spaces.forEach(space => {
      spaceDocuments[space.id] = []

      if (space.data.documents && space.data.documents.length > 0 && documents.length > 0) {
        space.data.documents.forEach(doc => {
          const matchingDoc = documents.find(d => d.type === doc.documentType && d.id + '' === doc.documentId + '')
          if (matchingDoc) {
            spaceDocuments[space.id].push(matchingDoc)
          }
        })
      }
    })

    return spaceDocuments
  }
)

export const recentSpaces = createSelector(
  getSpaces,
  spaces => {
    spaces = spaces.filter(space => space.permissions && space.permissions.hasMembership)
    spaces = sortBy(spaces, space => space.data.lastViewed || space.data.updatedAt).reverse().slice(0, 3)
    return spaces
  }
)

export const teamSpaceCount = createSelector(
  getSpaces,
  getTeamId,
  (spaces, teamId) => {
    spaces = spaces.filter(space => space.data.isPublic && space.data.teamId === teamId)
    return spaces.length
  }
)
