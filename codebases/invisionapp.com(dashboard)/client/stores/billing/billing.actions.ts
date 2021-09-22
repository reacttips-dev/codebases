import { Dispatch } from 'redux'
import { createAction } from 'redux-actions'

import { generateConsts } from '../utils/generators'
import bffRequest, { BFFResponse, BFFResponseError } from '../../utils/bffRequest'
import { AppState } from '..'
import { selectPermissions } from '../permissions'
import {
  arePlansLoaded,
  isSubscriptionLoading,
  isSubscriptionLoaded,
  selectShowStatus,
  arePlansLoading,
  selectIsBillableLoaded,
  selectIsBillableLoading
} from './billing.selectors'
import { GetState } from '../app'
import { Billable, Plan, SubscriptionData } from './billing.types'

/* ------ SUBSCRIPTION ------ */

export const FETCH_SUBSCRIPTION = generateConsts('billing/subscription/FETCH')

export const subscriptionActions = {
  failure: createAction(FETCH_SUBSCRIPTION.FAILURE, (error: BFFResponseError) => error),
  request: createAction(FETCH_SUBSCRIPTION.REQUEST),
  success: createAction(FETCH_SUBSCRIPTION.SUCCESS, (data: SubscriptionData) => data)
}

export function fetchSubscription() {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState()

    if (isSubscriptionLoading(state)) {
      return Promise.resolve()
    }

    dispatch(subscriptionActions.request())

    return bffRequest
      .get(`/teams/api/billing/subscription`)
      .then((response: BFFResponse) => {
        dispatch(subscriptionActions.success(response.data))
      })
      .catch((error: BFFResponseError) => {
        dispatch(subscriptionActions.failure(error))
      })
  }
}

/* ------ PLANS ------ */

export const FETCH_PLANS = generateConsts('billing/plans/FETCH')

export const plansActions = {
  failure: createAction(FETCH_PLANS.FAILURE, (error: BFFResponseError) => error),
  request: createAction(FETCH_PLANS.REQUEST),
  success: createAction(FETCH_PLANS.SUCCESS, (data: Plan[]) => data)
}

export function fetchPlans() {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState()

    if (arePlansLoading(state)) {
      return Promise.resolve()
    }

    dispatch(plansActions.request())

    return bffRequest
      .get(`/teams/api/billing/plans`)
      .then((response: BFFResponse) => {
        dispatch(plansActions.success(response.data))
      })
      .catch((error: BFFResponseError) => {
        dispatch(plansActions.failure(error))
      })
  }
}

/* ------ BILLABLE USERS ------ */

export const FETCH_BILLABLE = generateConsts('billing/plans/billable/FETCH')

export const billableActions = {
  failure: createAction(FETCH_BILLABLE.FAILURE, (error: BFFResponseError) => error),
  request: createAction(FETCH_BILLABLE.REQUEST),
  success: createAction(FETCH_BILLABLE.SUCCESS, (data: Billable) => data)
}

export function fetchBillable() {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState()

    if (selectIsBillableLoading(state)) {
      return Promise.resolve()
    }

    dispatch(billableActions.request())

    return bffRequest
      .get(`/teams/api/billing/billable`)
      .then((response: BFFResponse) => {
        dispatch(billableActions.success(response.data))
      })
      .catch((error: BFFResponseError) => {
        dispatch(billableActions.failure(error))
      })
  }
}

export function fetchBillableUsers() {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const state = getState()
    const isSubLoaded = isSubscriptionLoaded(state)
    const showStatusFlag = selectShowStatus(state)
    const areBillableUsersLoaded = selectIsBillableLoaded(state)

    if (showStatusFlag && isSubLoaded && !areBillableUsersLoaded) {
      dispatch(fetchBillable())
    }
  }
}

/* ------ BILLING INFO ------ */

export function fetchBillingInfo() {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const state = getState()

    const permissions = selectPermissions(state)
    const isLoaded = isSubscriptionLoaded(state) && arePlansLoaded(state)
    const canViewBilling = permissions['Subscription.ViewBilling']

    // already fetched both subs and plans: nothing to do
    if (isLoaded) {
      return
    }

    dispatch(fetchSubscription())

    if (canViewBilling) {
      dispatch(fetchPlans())
    }
  }
}
