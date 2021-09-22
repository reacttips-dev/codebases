import { createSelector } from 'reselect'
import moment from 'moment'

import { selectGuestStatusFlag } from '../featureFlags'
import { AppState } from '../index'
import { BILLING_PLAN_PRO } from '../../constants/billing'
import { SubscriptionState } from './billing.types'

/* ------ SUBSCRIPTION ------ */

export const selectSubscriptionState = (state: AppState) => state.billing.subscription

export const isSubscriptionLoading = createSelector(
  [selectSubscriptionState],
  subscriptionState => subscriptionState.status === 'loading'
)

export const isSubscriptionLoaded = createSelector(
  [selectSubscriptionState],
  subscriptionState => subscriptionState.status === 'loaded'
)

const selectSubscriptionData = createSelector(
  [selectSubscriptionState],
  (subscriptionState: SubscriptionState) => {
    return subscriptionState.data
  }
)

export const selectTrial = createSelector([selectSubscriptionData], subscriptionData => {
  return subscriptionData ? subscriptionData.trial : undefined
})

export const selectTrialPlan = createSelector([selectTrial], trial => {
  return trial ? trial.plan : undefined
})

export const selectTrialPlanName = createSelector([selectTrialPlan], plan => {
  return plan ? plan.name : undefined
})

export const selectTrialPlanDefaultSeatType = createSelector([selectTrialPlan], trialPlan => {
  return trialPlan ? trialPlan.defaultSeatType : undefined
})

export const selectTrialPlanDefaultSeatTypeId = createSelector(
  [selectTrialPlanDefaultSeatType],
  trialPlanDefaultSeatType => {
    return trialPlanDefaultSeatType ? trialPlanDefaultSeatType.seatTypeId : undefined
  }
)

export const selectTrialPlanSeats = createSelector([selectTrialPlan], trialPlan => {
  return trialPlan ? trialPlan.seats : undefined
})

export const selectTrialExpiresOn = createSelector([selectTrial], trial => {
  return trial ? trial.expiresOn : undefined
})

export const selectSubscriptionPlan = createSelector(
  [selectSubscriptionData],
  subscriptionData => {
    return subscriptionData ? subscriptionData.plan : undefined
  }
)

export const selectPlanName = createSelector([selectSubscriptionPlan], plan => {
  return plan ? plan.name : undefined
})

export const selectPlanDefaultSeatType = createSelector([selectSubscriptionPlan], plan => {
  return plan ? plan.defaultSeatType : undefined
})

export const selectPlanDefaultSeatTypeId = createSelector(
  [selectPlanDefaultSeatType],
  planDefaultSeatType => {
    return planDefaultSeatType ? planDefaultSeatType.seatTypeId : undefined
  }
)

export const selectPlanSeats = createSelector([selectSubscriptionPlan], plan => {
  return plan ? plan.seats : undefined
})

// sort by seatTypeId:
// Creator > Collaborator > Freehand
export const selectSeats = createSelector(
  [selectTrialPlanSeats, selectPlanSeats],
  (trialPlanSeats, planSeats) => {
    const seats = trialPlanSeats ?? planSeats ?? []

    // 'sort' doesn't throw an error if the array is empty, it just returns []
    return seats.sort((a, b) => (a.seatTypeId > b.seatTypeId ? 1 : -1))
  }
)

export const selectDefaultSeatId = createSelector(
  [selectTrialPlanDefaultSeatTypeId, selectPlanDefaultSeatTypeId],
  (trialPlanDefaultSeatTypeId, planDefaultSeatTypeId) => {
    return trialPlanDefaultSeatTypeId ?? planDefaultSeatTypeId
  }
)

export const selectIsMultiSeatPlan = createSelector(selectSeats, seats => seats.length > 1)

export const selectNumberOfTrialDaysRemaining = createSelector(
  [selectTrialExpiresOn],
  expiresOn => {
    if (expiresOn) {
      return moment
        .utc(expiresOn)
        .endOf('day')
        .diff(
          moment()
            .utc()
            .endOf('day'),
          'days'
        )
    }
    return -1
  }
)

export const selectIsOnTrial = createSelector(
  selectNumberOfTrialDaysRemaining,
  daysRemaining => {
    return daysRemaining > -1
  }
)

export const selectIsFreePlan = createSelector(
  selectPlanName,
  selectIsOnTrial,
  (planName, isOnTrial) => {
    return planName?.toLowerCase() === 'free' && isOnTrial === false
  }
)

export const selectIsEnterprisePlan = createSelector(
  selectPlanName,
  selectTrialPlanName,
  (planName, planTrialName) => {
    return (
      planName?.toLowerCase() === 'enterprise' || planTrialName?.toLowerCase() === 'enterprise'
    )
  }
)

export const selectIsProPlan = createSelector(
  selectPlanName,
  selectTrialPlanName,
  (planName, planTrialName) =>
    planName?.toLowerCase() === 'pro' || planTrialName?.toLowerCase() === 'pro'
)

// phase 1 won't allow freehand trials, but eventually it will be available
export const selectIsFreehandPlan = createSelector(
  selectPlanName,
  selectTrialPlanName,
  (planName, planTrialName) =>
    planName?.toLowerCase() === 'freehand_free' ||
    planTrialName?.toLowerCase() === 'freehand_free'
)

export const selectShowStatus = createSelector(
  selectGuestStatusFlag,
  selectIsEnterprisePlan,
  (guestStatusFlag, isEnterprisePlan) => {
    return guestStatusFlag && isEnterprisePlan
  }
)

/* ------ PLANS ------ */

export const selectPlansState = (state: AppState) => state.billing.plans

export const arePlansLoading = createSelector([selectPlansState], plansState => {
  return plansState.status === 'loading'
})

export const arePlansLoaded = createSelector([selectPlansState], plansState => {
  return plansState.status === 'loaded'
})

export const selectPlansData = createSelector([selectPlansState], plansState => {
  return plansState.data
})

export const selectPlans = createSelector([selectPlansData], plansData => {
  if (plansData === undefined) {
    return undefined
  }

  return Object.values(plansData)
})

export const selectProPlan = createSelector(
  [arePlansLoaded, selectPlans],
  (plansLoaded, plans) => {
    if (plansLoaded === false || plans === undefined) {
      return undefined
    }

    // TODO: why does this only check plan.name when the others also check planName
    return plans.filter(
      plan => plan?.name?.toLowerCase() === BILLING_PLAN_PRO.toLowerCase()
    )[0]
  }
)

export const selectCanStartProTrial = createSelector(
  [selectProPlan, selectTrial],
  (proPlan, trial) => {
    if (
      proPlan === undefined ||
      trial === undefined ||
      proPlan.trialAvailable === undefined ||
      proPlan.trialAvailable === false ||
      proPlan.hasTrialed === undefined ||
      proPlan.hasTrialed === false
    ) {
      return false
    }

    return true
  }
)

/* ------ BILLABLE USERS ------ */

const selectBillableState = (state: AppState) => state.billing.billable

export const selectIsBillableLoading = createSelector([selectBillableState], billableState => {
  return billableState && billableState.status === 'loading'
})

export const selectIsBillableLoaded = createSelector([selectBillableState], billableState => {
  return billableState && billableState.status === 'loaded'
})

export const selectBillableUserIds = createSelector(
  selectBillableState,
  selectShowStatus,
  selectIsBillableLoaded,
  (billable, showStatusFlag, isBillableLoaded) => {
    if (!billable || !billable.data || !isBillableLoaded || !showStatusFlag) {
      return []
    }

    const activeUsers = billable.data.activeUsers || []
    const ids = activeUsers.map(user => user.userId)

    return ids
  }
)
