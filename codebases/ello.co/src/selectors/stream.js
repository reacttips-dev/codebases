import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectPages } from './pages'
import { selectJson } from './store'
import { selectPathname } from './routing'
import { emptyPagination } from '../reducers/json'

// props.xxx
const selectMeta = (state, props) => get(props, 'action.meta', {})

// state.stream.xxx
export const selectStreamType = state => state.stream.get('type')

// state.stream.meta.xxx
export const selectStreamMappingType = state => state.stream.getIn(['meta', 'mappingType'])

// state.stream.payload.xxx
export const selectStreamPostIdOrToken = state => state.stream.getIn(['payload', 'postIdOrToken'])

export const selectStreamResultPath = createSelector(
  [selectMeta, selectPathname], (meta, pathname) =>
    meta.resultKey || pathname,
)

export const selectStreamUnfilteredResult = createSelector(
  [selectPages, selectStreamResultPath], (pages, resultPath) =>
    pages.get(resultPath, Immutable.Map({ ids: Immutable.List(), pagination: emptyPagination() })),
)

// Memoized selectors
export const selectStreamFilteredResult = createSelector(
  [selectStreamUnfilteredResult, selectJson, selectPathname],
  (unfilteredResult, json, pathname) => {
    // don't filter out blocked ids if we are in settings
    // since you can unblock/unmute them from there
    const delTypes = json.get(`deleted_${unfilteredResult.get('type')}`, Immutable.List())
    return unfilteredResult.set('ids', unfilteredResult.get('ids').filter(value =>
      pathname === '/settings' || !delTypes.includes(value),
    ))
  },
)
