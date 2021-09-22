import {
  ROUTE_ARCHIVED_DOCUMENTS,
  ROUTE_DOCUMENTS,
  ROUTE_DOCUMENT_TYPE_ALL,
  ROUTE_DOCUMENT_TYPE_ARCHIVED,
  ROUTE_DOCUMENT_TYPE_CREATED_BY_ME,
  ROUTE_MY_CREATED_DOCUMENTS,
  ROUTE_TEAM_DOCUMENTS
} from '../constants/AppRoutes'

import { FILTER_URL_PATHS } from '../constants/FilterTypes'

const generateTypeFilteredURL = (type, viewFilter, isExternalDocFilterPath, enableFreehandXFilteringSorting = false) => {
  if (enableFreehandXFilteringSorting) {
    return ROUTE_DOCUMENTS
  }

  if (!type || type.toLowerCase() === 'all documents') {
    return viewFilter === 'archive'
      ? ROUTE_ARCHIVED_DOCUMENTS
      : viewFilter === 'user'
        ? ROUTE_MY_CREATED_DOCUMENTS
        : ROUTE_TEAM_DOCUMENTS
  }

  let urlType = ''

  if (isExternalDocFilterPath) {
    urlType = type
  } else {
    for (let key in FILTER_URL_PATHS) {
      if (key.toLowerCase() === type.toLowerCase()) {
        urlType = FILTER_URL_PATHS[key]
      }
    }
  }

  if (!urlType) return ''

  const destinationURL =
    viewFilter === 'archive'
      ? ROUTE_DOCUMENT_TYPE_ARCHIVED
      : viewFilter === 'user'
        ? ROUTE_DOCUMENT_TYPE_CREATED_BY_ME
        : ROUTE_DOCUMENT_TYPE_ALL

  return destinationURL.replace(':type', urlType) + window.location.search
}

export default generateTypeFilteredURL
