import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { BADGES } from '../constants/mapping_types'

const selectPropsBadgeId = (state, props) => get(props, 'badgeId')

export const selectBadges = state => state.json.get(BADGES, Immutable.List())

// Memoized selectors
export const selectBadge = createSelector(
  [selectBadges, selectPropsBadgeId], (badges, badgeId) =>
    badges.find(badge => badge.get('slug') === badgeId),
)

export const selectBadgesHasLoaded = createSelector(
  [selectBadges], badges => !badges.isEmpty(),
)

