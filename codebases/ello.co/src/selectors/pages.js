import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { emptyPagination } from '../reducers/json'
import { selectPathname } from './routing'

const selectMeta = (state, props) => get(props, 'action.meta', {})

// state.json.pages.xxx
export const selectPages = state => state.json.get('pages')

export const selectPagesResult = createSelector(
  [selectMeta, selectPathname, selectPages], (meta, pathname, pages) =>
    (pages ? pages.get(
      meta.resultKey || pathname,
      Immutable.Map({ ids: Immutable.List(), pagination: emptyPagination() }),
    ) : Immutable.Map({ ids: Immutable.List(), pagination: emptyPagination() })),
)

// Memoized selectors
export const selectPage = createSelector(
  [selectPages, selectPathname], (pages, pathname) =>
    pages.get(pathname, null),
)
