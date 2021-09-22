export const SORT_CREATED = 'Date created'
export const SORT_UPDATED = 'Last updated'
export const SORT_RECENT = 'Last viewed'
export const SORT_ALPHA = 'A-Z'
export const SORT_DOC_COUNT = 'Document count'

export const DOCUMENTS_SORTS = [SORT_CREATED, SORT_UPDATED, SORT_RECENT, SORT_ALPHA]
export const SPACES_SORTS = [SORT_DOC_COUNT, SORT_RECENT, SORT_ALPHA]
export const PAGINATED_SPACES_SORTS = [SORT_RECENT, SORT_ALPHA]

export const DOCUMENTS_DEFAULT_SORT = SORT_RECENT
export const SPACES_DEFAULT_SORT = SORT_ALPHA

export const ANALYTICS_SORTS = {
  [SORT_ALPHA]: 'alphabetical',
  [SORT_CREATED]: 'created',
  [SORT_RECENT]: 'viewed',
  [SORT_UPDATED]: 'updated',
  [SORT_DOC_COUNT]: 'count'
}
