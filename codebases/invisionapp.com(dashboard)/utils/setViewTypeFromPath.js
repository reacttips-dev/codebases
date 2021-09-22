import {
  ROUTE_ARCHIVED_DOCUMENTS,
  ROUTE_DOCUMENT_TYPE_ALL,
  ROUTE_DOCUMENT_TYPE_ARCHIVED,
  ROUTE_DOCUMENT_TYPE_CREATED_BY_ME,
  ROUTE_DOCUMENTS,
  ROUTE_HOME,
  ROUTE_MY_CREATED_DOCUMENTS,
  ROUTE_MY_CREATED_SPACES,
  ROUTE_MY_DOCUMENTS,
  ROUTE_MY_SPACES,
  ROUTE_SEARCH,
  ROUTE_SPACES,
  ROUTE_TEAM_DOCUMENTS,
  ROUTE_TEAM_SPACES
} from '../constants/AppRoutes'

export default function setViewTypeFromPath (path) {
  let viewType = 'recents'
  let isTeam = false
  let isArchived = false

  switch (path) {
    case ROUTE_ARCHIVED_DOCUMENTS:
    case ROUTE_DOCUMENTS:
    case ROUTE_MY_DOCUMENTS:
    case ROUTE_MY_CREATED_DOCUMENTS:
    case ROUTE_TEAM_DOCUMENTS:
    case ROUTE_DOCUMENT_TYPE_ALL:
    case ROUTE_DOCUMENT_TYPE_CREATED_BY_ME:
    case ROUTE_DOCUMENT_TYPE_ARCHIVED:
      viewType = 'documents'
      isArchived = [ROUTE_ARCHIVED_DOCUMENTS, ROUTE_DOCUMENT_TYPE_ARCHIVED].indexOf(path) >= 0
      isTeam = [ROUTE_DOCUMENTS, ROUTE_TEAM_DOCUMENTS, ROUTE_DOCUMENT_TYPE_ALL].indexOf(path) >= 0
      break

    case ROUTE_MY_CREATED_SPACES:
    case ROUTE_MY_SPACES:
    case ROUTE_SPACES:
    case ROUTE_TEAM_SPACES:
      viewType = 'spaces'
      isTeam = [ROUTE_SPACES, ROUTE_TEAM_SPACES].indexOf(path) >= 0
      break

    case ROUTE_SEARCH:
      viewType = 'search'
      break

    case ROUTE_HOME:
    default:
      viewType = 'documents'
      isTeam = true
      break
  }

  return {
    viewType,
    isTeam,
    isArchived
  }
}
