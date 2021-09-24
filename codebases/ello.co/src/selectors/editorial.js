import { Map } from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { EDITORIALS } from '../constants/mapping_types'

const selectPropsSize = (state, props) =>
  get(props, 'size', '1x1')

const selectPropsPosition = (state, props) =>
  get(props, 'position')

export const selectPropsEditorialId = (state, props) =>
  get(props, 'editorialId') || get(props, 'editorial', Map()).get('id')

export const selectEditorials = state => state.json.get(EDITORIALS, Map())

// Memoized selectors

// Requires `editorialId` or `editorial` to be found in props
export const selectEditorial = createSelector(
  [selectPropsEditorialId, selectEditorials],
  (editorialId, editorials) =>
    editorials.get(editorialId, Map()),
)

export const selectEditorialImageSource = createSelector(
  [selectEditorial, selectPropsSize], (editorial, size) => {
    switch (size) {
      case '2x2': return editorial.get('twoByTwoImage', Map())
      case '2x1': return editorial.get('twoByOneImage', Map())
      case '1x2': return editorial.get('oneByTwoImage', Map())
      case '1x1': return editorial.get('oneByOneImage', Map())
      default: return editorial.get('oneByOneImage', Map())
    }
  },
)

export const selectEditorialKind = createSelector(
  [selectEditorial], editorial =>
    editorial.get('kind'),
)

export const selectEditorialPath = createSelector(
  [selectEditorial], editorial =>
    editorial.get('path'),
)

export const selectEditorialPostId = createSelector(
  [selectEditorial], editorial =>
    editorial.getIn(['links', 'post', 'id']),
)

export const selectEditorialPostStreamQuery = createSelector(
  [selectEditorial], editorial =>
    editorial.getIn(['links', 'postStream', 'query']),
)

export const selectEditorialPostStreamVariables = createSelector(
  [selectEditorial], editorial =>
    editorial.getIn(['links', 'postStream', 'variables']),
)

export const selectEditorialUrl = createSelector(
  [selectEditorial], editorial =>
    editorial.get('url'),
)

// Derived
export const selectEditorialAnalyticsOptions = createSelector(
  [selectEditorialKind, selectEditorialPostId, selectPropsPosition, selectPropsSize],
  (kind, postId, position, size) => (
    {
      kind,
      ...(postId ? { postId } : {}),
      parent: 'editorial',
      position,
      size,
    }
  ))

