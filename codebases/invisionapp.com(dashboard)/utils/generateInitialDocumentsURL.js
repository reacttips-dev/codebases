import { GET_RESOURCES } from '../constants/ServerURLs'
import { SORT_ALPHA, SORT_CREATED, SORT_UPDATED } from '../constants/SortTypes'
import getCookie from './getCookie'

export const getStoredSort = () => {
  const defaultSort = 'userLastAccessedAt'

  try {
    const sortCookie = getCookie('inv-home-docs-sortby')
    if (sortCookie && ['createdAt', 'updatedAt', 'title'].indexOf(sortCookie) !== -1) {
      return sortCookie
    } else if (sortCookie) {
      return defaultSort
    }

    if (!sortCookie) {
      const sorts = window.localStorage.getItem('home-sorts')
      if (sorts) {
        const parsed = JSON.parse(sorts)
        if (parsed && parsed.documentsSort) {
          switch (parsed.documentsSort) {
            case SORT_CREATED:
              return 'createdAt'
            case SORT_UPDATED:
              return 'updatedAt'
            case SORT_ALPHA:
              return 'title'
          }
        }
      } else {
        return defaultSort
      }
    }
  } catch (e) {
    return defaultSort
  }
}

export const parseFilterType = (url) => {
  const typeRegex = /\/docs\/((?!created-by-me|archived|all)((\w)*-)*(\w)+)(?:|\/|\/created-by-me|\/archived)?\/?$/i
  const typeParser = url.match(typeRegex)
  if (typeParser && typeParser[1]) {
    const type = typeParser[1]

    switch (type) {
      case 'designs':
        return 'harmony'
      case 'prototypes':
        return 'prototype&types=presentation'
      case 'docs':
        return 'rhombus'
      default:
        return type.substring(0, type.length - 1)
    }
  }

  return ''
}

const generateProjectsListRequestUrl = (
  url,
  externalDocFilterEntries,
  isExternal,
  docType,
  enableFreehandXFilteringSorting
) => {
  let params = {
    limit: 50,
    includeAssetURLs: true
  }

  // Created by Me
  if (url.match(/\/created-by-me$/i)) {
    params.createdByMe = true
  }

  // Sorts
  params.sortBy = getStoredSort()
  params.sortOrder = params.sortBy === 'title' ? 'asc' : 'desc'

  // Type filtering
  const type = enableFreehandXFilteringSorting ? '' : parseFilterType(url)
  let encodeTypesInQueryParam = true
  if (isExternal) {
    params.types = externalDocFilterEntries[docType]?.filterTypes?.join('&types=')
    encodeTypesInQueryParam = false
  } else {
    if (type !== '') {
      params.types = type
    }
  }

  // Is Archived?
  params.isArchived = !!url.match(/\/archived$/i)

  // Is in space?
  const spaceRegEx = /\/spaces\/[\w\d-]*-(c[\w\d]+)/i
  const spaceParser = url.match(spaceRegEx)
  if (spaceParser && spaceParser[1]) {
    params.spaceID = spaceParser[1]
  }

  // Projects
  const projectRegEx = /\/projects\/[\w\d-]*-(c[\w\d]+)/i
  const projectParser = url.match(projectRegEx)
  if (projectParser && projectParser[1]) {
    params.projectID = projectParser[1]
  }

  const query = Object.keys(params)
    .sort((a, b) => a.localeCompare(b))
    // TODO - This is a little janky, but the problem is the code has to be replicated as minimally as possible on the cloud-ui
    // side. This just ensures that it passes along the correct types for prototypes, but I think it would be worth investing time
    // to clean this up on the BFF side to pass both prototype and presentation in for types by default, rather than
    // requiring it on the frontend.
    .map((key) => `${key}=${
      params[key] === 'prototype&types=presentation' ||
        (key === 'types' && !encodeTypesInQueryParam)
        ? params[key] : encodeURIComponent(params[key])}`)
    .join('&')

  return {
    params,
    url: `${GET_RESOURCES}?${query}`
  }
}

export default generateProjectsListRequestUrl
