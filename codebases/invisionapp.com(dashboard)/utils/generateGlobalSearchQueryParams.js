import queryString from 'query-string'
import { uniq } from 'lodash'

import {
  FILTER_ALL,
  FILTER_HARMONY,
  FILTER_PROTOTYPES,
  FILTER_BOARDS,
  FILTER_SPECS,
  FILTER_FREEHANDS,
  FILTER_RHOMBUS,
  FILTER_INVISION
} from '../constants/FilterTypes'

const generateGlobalSearchQueryParams = filters => {
  if (!filters) {
    return ''
  }

  const { filterType, projectId, searchTerm, spaceId, searchView, cursor, supportedExternalTypes = [], externalDocFilterEntries = {} } = filters
  let params = {}
  let filterTypes = []

  // Document type
  if (!searchView || searchView === 'documents' || searchView === 'spaceDocuments' || searchView === 'projectDocuments') {
    switch (filterType) {
      case FILTER_ALL:
        // Discovery api returns spaces as well when no types are specified. That makes sense, given
        // in the future we will likely unify the documents grid and list to support a mix set of
        // documents and spaces. Hence, when filtering for all, internally specify all document types
        // we are looking for.

        // getting the unique set of filterTypes from each Filter option
        const uniqExternalFilterTypes = uniq(
          supportedExternalTypes.reduce((extFilterDocTypes, filterType) => {
            externalDocFilterEntries[filterType].filterTypes.forEach(docType => {
              extFilterDocTypes.push(docType)
            })
            return extFilterDocTypes
          }, [])
        )

        filterTypes = ['harmony', 'prototype', 'presentation', 'board', 'spec', 'freehand', 'rhombus'].concat(uniqExternalFilterTypes)
        break

      case FILTER_INVISION:
        filterTypes = ['harmony', 'prototype', 'presentation', 'board', 'spec', 'freehand', 'rhombus']
        break
      case FILTER_HARMONY:
        filterTypes = ['harmony']
        break
      case FILTER_PROTOTYPES:
        filterTypes = ['prototype', 'presentation']
        break
      case FILTER_BOARDS:
        filterTypes = ['board']
        break
      case FILTER_SPECS:
        filterTypes = ['spec']
        break
      case FILTER_FREEHANDS:
        filterTypes = ['freehand']
        break
      case FILTER_RHOMBUS:
        filterTypes = ['rhombus']
        break
      default:
        filterTypes = externalDocFilterEntries?.[filterType] ? externalDocFilterEntries[filterType].filterTypes : [filterType]
        break
    }

    params.types = filterTypes
  }

  if (searchView === 'spaces') {
    params.types = ['space', 'project']
  }

  if (searchTerm && searchTerm.length > 0) {
    // Note that the query-string npm also properly html encodes query params,
    // so no need to use encodeURIComponent to encode the search term
    params.search = searchTerm
  }

  if (projectId && projectId.length > 0) {
    params.projectID = projectId
  } else if (spaceId && spaceId.length > 0) {
    params.spaceID = spaceId
  }

  if (cursor && cursor.length > 0) {
    params.cursor = cursor
  }

  return queryString.stringify(params, {
    skipNull: true,
    skipEmptyString: true
  })
}

export default generateGlobalSearchQueryParams
