// Documents
export const ROUTE_ARCHIVED_DOCUMENTS = '/docs/archived'
export const ROUTE_DOCUMENTS = '/docs'
export const ROUTE_HOME = '/'
export const ROUTE_MY_DOCUMENTS = '/docs/my-documents'
export const ROUTE_TEAM_DOCUMENTS = '/docs/all'
export const ROUTE_MY_CREATED_DOCUMENTS = '/docs/created-by-me'

// Documents by type
export const ROUTE_DOCUMENT_TYPE_ALL = `/docs/:type`
export const ROUTE_DOCUMENT_TYPE_CREATED_BY_ME = `/docs/:type/created-by-me`
export const ROUTE_DOCUMENT_TYPE_ARCHIVED = `/docs/:type/archived`

// Spaces
export const ROUTE_MY_CREATED_SPACES = '/spaces/created-by-me'
export const ROUTE_MY_SPACES = '/spaces/my-spaces'
export const ROUTE_SPACES = '/spaces'
export const ROUTE_TEAM_SPACES = '/spaces/all'

// Space
export const ROUTE_SPACE = '/spaces/:cuid'
export const ROUTE_SPACE_PROJECTS = '/spaces/:cuid/projects'
export const ROUTE_SPACE_ALL = '/spaces/:cuid/all'
export const ROUTE_SPACE_MY_DOCUMENTS = '/spaces/:cuid/created-by-me'
export const ROUTE_SPACE_ARCHIVED_DOCUMENTS = '/spaces/:cuid/archived'

// Projects
export const ROUTE_PROJECT = '/projects/:projectId'
export const ROUTE_PROJECT_MY_DOCUMENTS = '/projects/:projectId/created-by-me'
export const ROUTE_PROJECT_ARCHIVED_DOCUMENTS = '/projects/:projectId/archived'
export const ROUTE_PROJECT_PROTOTYPE = '/projects/:projectId/new'

// Pages
export const ROUTE_PAGES = '/spaces/pages'

// Legacy Routes
export const LEGACY_SPACE = '/space/:cuid'

// Search
export const ROUTE_SEARCH = '/search'

// Routes types (for analytics)
export const ROUTE_TYPE_DOCUMENTS = 'documents'
export const ROUTE_TYPE_RECENTS = 'recents'
export const ROUTE_TYPE_PROJECTS = 'projects'
export const ROUTE_TYPE_SPACES = 'spaces'
export const ROUTE_TYPE_SPACE = 'space'
