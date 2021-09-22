import queryString from 'query-string'

import {
  FILTER_ALL,
  FILTER_HARMONY,
  FILTER_PROTOTYPES,
  FILTER_BOARDS,
  FILTER_SPECS,
  FILTER_FREEHANDS,
  FILTER_RHOMBUS
} from '../constants/FilterTypes'

const parseSearchUrl = (searchQuery = '') => {
  try {
    // Note that the query-string npm also properly html decodes query params,
    // so no need to use decodeURIComponent to decode the search term
    const { query } = queryString.parseUrl(searchQuery, {
      skipNull: true,
      skipEmptyString: true
    })

    let searchQueryParams = {}

    if (query.projectID && !Array.isArray(query.projectID)) {
      searchQueryParams.projectId = query.projectID
      searchQueryParams.searchView = 'projectDocuments'
    } else if (query.spaceID && !Array.isArray(query.spaceID)) {
      searchQueryParams.spaceId = query.spaceID
      searchQueryParams.searchView = 'spaceDocuments'
    }

    if (query.search) {
      const search = Array.isArray(query.search)
        ? query.search.join(' ')
        : query.search
      searchQueryParams.searchTerm = search
    }

    if (query.types) {
      if (Array.isArray(query.types)) {
        searchQueryParams.documentType = FILTER_ALL
      } else {
        // normalize filter type
        const types = query.types.toLowerCase()
        switch (types) {
          case FILTER_HARMONY.toLowerCase():
            searchQueryParams.documentType = FILTER_HARMONY
            break

          case FILTER_PROTOTYPES.toLowerCase():
            searchQueryParams.documentType = FILTER_PROTOTYPES
            break

          case FILTER_BOARDS.toLowerCase():
            searchQueryParams.documentType = FILTER_BOARDS
            break

          case FILTER_SPECS.toLowerCase():
            searchQueryParams.documentType = FILTER_SPECS
            break

          case FILTER_FREEHANDS.toLowerCase():
            searchQueryParams.documentType = FILTER_FREEHANDS
            break

          case FILTER_RHOMBUS.toLowerCase():
            searchQueryParams.documentType = FILTER_RHOMBUS
            break

          case 'spaces':
            // Note: for spaces, the search view type changes, not the document filter
            searchQueryParams.searchView = 'spaces'
            break

          default:
            searchQueryParams.documentType = FILTER_ALL
        }
      }
    }

    return searchQueryParams
  } catch {
    // If we fail to parse the URL, simply fall back to no filters
    return {}
  }
}

export default parseSearchUrl
