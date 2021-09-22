import {
  ROUTE_TYPE_DOCUMENTS,
  ROUTE_TYPE_RECENTS,
  ROUTE_TYPE_PROJECTS,
  ROUTE_TYPE_SPACES,
  ROUTE_TYPE_SPACE,
  ROUTE_SEARCH
} from '../constants/AppRoutes.js'

const regex = {
  documents: /^\/?docs\/?([a-z-]*)?\/?$/i,
  recents: /^\/$/,
  projects: /^\/projects\/(?:[a-z0-9-]+\/?)$/i,
  spaces: /^\/spaces\/?([a-z-]*)?\/?$/i,
  space: /^\/spaces\/(?:[a-z0-9-]+\/?)$/i,
  search: /^\/search\/?/i
}

export function mapPathname (pathname) {
  if (regex.documents.test(pathname)) return ROUTE_TYPE_DOCUMENTS
  if (regex.recents.test(pathname)) return ROUTE_TYPE_RECENTS
  if (regex.projects.test(pathname)) return ROUTE_TYPE_PROJECTS
  if (regex.spaces.test(pathname)) return ROUTE_TYPE_SPACES
  if (regex.space.test(pathname)) return ROUTE_TYPE_SPACE
  if (regex.search.test(pathname)) return ROUTE_SEARCH

  return 'unknown-path-type'
}

const sidebarRegex = {
  'documents-createdbyme': /^\/docs\/created-by-me\/?/i,
  'documents-archived': /^\/docs\/archived\/?/i,
  'documents-all': /^\/$|^\/docs\/?/i,
  'space-archived': /^\/spaces\/(?:[a-z0-9-]+?)\/archived\/?/i,
  'space-createdbyme': /^\/spaces\/(?:[a-z0-9-]+?)\/created-by-me\/?/i,
  'project-archived': /^\/projects\/(?:[a-z0-9-]+?)\/archived\/?/i,
  'project-createdbyme': /^\/projects\/(?:[a-z0-9-]+?)\/created-by-me\/?/i,
  'project-all': /^\/projects\/(?:[a-z0-9-]+\/?)$/i,
  'space-all': /^\/spaces\/(?:[a-z0-9-]+\/?)(\/all)?$/i,
  'space-projects': /^\/spaces\/(?:[a-z0-9-]+\/?)\/projects$/i,
  'search': /^\/search\/?/i
}

export function mapSidebarPathname (pathname) {
  pathname = pathname.split('?')[0]
  for (const key in sidebarRegex) {
    if (sidebarRegex[key].test(pathname)) return key
  }

  return 'unknown-path-type'
}
