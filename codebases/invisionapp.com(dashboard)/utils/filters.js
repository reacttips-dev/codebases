import {
  ROUTE_DOCUMENTS,
  ROUTE_MY_DOCUMENTS,
  ROUTE_TEAM_DOCUMENTS,
  ROUTE_ARCHIVED_DOCUMENTS,
  ROUTE_MY_SPACES,
  ROUTE_TEAM_SPACES,
  ROUTE_SPACES,
  ROUTE_MY_CREATED_DOCUMENTS,
  ROUTE_MY_CREATED_SPACES
} from '../constants/AppRoutes'

// Internal analytics util - converts the current path to its page name
export const analyticsPathToPageName = (path) => {
  switch (path) {
    case '/':
    case ROUTE_MY_CREATED_DOCUMENTS:
      return 'Documents-Created-By-Me'
    case ROUTE_MY_DOCUMENTS:
      return 'My-Documents'
    case ROUTE_TEAM_DOCUMENTS:
    case ROUTE_DOCUMENTS:
      return 'Team-Documents'
    case ROUTE_ARCHIVED_DOCUMENTS:
      return 'Archived-Documents'
    case ROUTE_MY_SPACES:
      return 'My-Spaces'
    case ROUTE_SPACES:
    case ROUTE_TEAM_SPACES:
      return 'Team-Spaces'
    case ROUTE_MY_CREATED_SPACES:
      return 'Spaces-Created-By-Me'
    default:
      // Unknown page
      return 'Unknown-Page'
  }
}
