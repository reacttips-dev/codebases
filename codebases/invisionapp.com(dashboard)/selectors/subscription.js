import { createSelector } from 'reselect'

const FREEHAND_FREE_PLAN_NAME = 'Freehand_Free'

const selectSubscription = state => state.subscription

export const isFreehandOnlyTeam = createSelector(
  selectSubscription,
  sub => {
    if (sub) {
      return sub.plan_name === FREEHAND_FREE_PLAN_NAME
    }
  }
)

export const isSubscriptionLoading = createSelector(
  selectSubscription,
  sub => {
    if (sub) {
      return sub.isLoading
    }
  }
)
