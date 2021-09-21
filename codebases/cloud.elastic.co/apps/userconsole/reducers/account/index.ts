/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { get } from 'lodash'

import {
  FETCH_ACCOUNT_ACTIVITY,
  FETCH_ACCOUNT_COSTS,
  FETCH_ACCOUNT_COST_OVERVIEW,
  FETCH_DEPLOYMENT_COST_ITEMS,
  FETCH_DEPLOYMENT_COST_ITEMS_BY_DEPLOYMENT,
  FETCH_ACCOUNT_DETAILS,
  FETCH_BILLING_HISTORY,
  FETCH_PROFILE,
  FETCH_USAGE_DETAILS,
  UPDATE_ACCOUNT_EMAIL,
  UPDATE_ACCOUNT_PASSWORD,
  UPDATE_ACCOUNT_DETAILS,
  UPDATE_CONTACTS,
  REQUEST_WHITELISTING,
  WHITELIST,
  CONFIRM_EMAIL_CHANGE,
  CLEAR_EMAIL_CHANGE_CONFIRMATION,
  UPDATE_BILLING_SUBSCRIPTION_LEVEL,
  FETCH_PREPAID_BALANCE_LINE_ITEMS,
} from '../../constants/actions'

import { getAsyncRequestState } from '../../../../reducers/asyncRequests'

import { replaceIn } from '../../../../lib/immutability-helpers'

const initialState = {
  ui: {},
  activity: undefined,
  costs: undefined,
  costsOverview: undefined,
  prepaidBalanceLineItems: undefined,
  costDetails: undefined,
  details: undefined,
  billingHistory: undefined,
}

export default function accountReducer(state = initialState, action) {
  if (!action.error && action.payload) {
    if (action.type === FETCH_ACCOUNT_ACTIVITY) {
      return {
        ...state,
        activity: makeActivity(action.payload),
      }
    }

    if (action.type === FETCH_ACCOUNT_COSTS) {
      const {
        payload,
        meta: { timePeriod },
      } = action

      return {
        ...state,
        costs: { ...payload, timePeriod },
      }
    }

    if (action.type === FETCH_ACCOUNT_COST_OVERVIEW) {
      const { payload } = action
      const {
        costs: { total },
        trials,
      } = payload

      return {
        ...state,
        costsOverview: {
          ...payload,
          isTrialConversionUser: trials > 0 && trials !== total,
          paidUsage: total - trials,
        },
      }
    }

    if (action.type === FETCH_PREPAID_BALANCE_LINE_ITEMS) {
      const {
        payload: { line_items },
      } = action
      return {
        ...state,
        prepaidBalanceLineItems: line_items,
      }
    }

    if (action.type === FETCH_DEPLOYMENT_COST_ITEMS) {
      const {
        payload,
        meta: { timePeriod },
      } = action

      return {
        ...state,
        deploymentItemsCosts: { ...payload, timePeriod },
      }
    }

    if (action.type === FETCH_DEPLOYMENT_COST_ITEMS_BY_DEPLOYMENT) {
      return {
        ...state,
        deploymentItemsCostsByDeployment: { ...action.payload },
      }
    }

    if (action.type === FETCH_ACCOUNT_DETAILS || action.type === UPDATE_CONTACTS) {
      return {
        ...state,
        details: makeDetails(action.payload),
      }
    }

    if (action.type === UPDATE_ACCOUNT_DETAILS) {
      return {
        ...state,
        details: makeProfileFromAccountDetails(action.payload),
      }
    }

    if (action.type === FETCH_BILLING_HISTORY) {
      return {
        ...state,
        billingHistory: makeBillingHistory(action.payload),
      }
    }

    if (action.type === UPDATE_ACCOUNT_EMAIL) {
      // preserve immediate UI since the email change is async on the backend
      return replaceIn(state, [`ui`, `newEmail`], action.meta.newEmail)
    }

    if (action.type === CONFIRM_EMAIL_CHANGE) {
      const withOutNewEmail = replaceIn(state, [`ui`, `newEmail`], null)
      const withDidChangeFlag = replaceIn(withOutNewEmail, [`ui`, `emailDidChange`], true)
      return withDidChangeFlag
    }

    if (action.type === FETCH_PROFILE) {
      // remove the pending email state if the user's actual email address changes
      const pendingEmail = get(state, [`ui`, `newEmail`])
      const fetchedEmail = action.payload.user.email

      if (pendingEmail && fetchedEmail !== pendingEmail) {
        return replaceIn(state, [`ui`, `newEmail`], null)
      }
    }
  }

  if (action.type === CLEAR_EMAIL_CHANGE_CONFIRMATION) {
    return replaceIn(state, [`ui`, `emailDidChange`], null)
  }

  if (action.type === FETCH_USAGE_DETAILS) {
    return {
      ...state,
      usage: action.payload,
    }
  }

  return state
}

export function getAccountUI(state) {
  return get(state, [`account`, `ui`], {})
}

export function getAccountActivity(state) {
  return get(state, [`account`, `activity`])
}

export function getAccountCostsOverview(state) {
  return get(state, [`account`, `costsOverview`])
}

export function getPrepaidBalanceLineItems(state) {
  return get(state, [`account`, `prepaidBalanceLineItems`])
}

export function getAccountCosts(state) {
  return get(state, [`account`, `costs`])
}

export function getDeploymentItemsCosts(state) {
  return get(state, [`account`, `deploymentItemsCosts`])
}

export function getDeploymentItemsCostsByDeployment(state) {
  return get(state, [`account`, `deploymentItemsCostsByDeployment`])
}

export function getAccountDetails(state) {
  return get(state, [`account`, `details`])
}

export function getBillingHistory(state) {
  return get(state, [`account`, `billingHistory`])
}

export function getUsageDetails(state) {
  return get(state, [`account`, `usage`])
}

export const fetchAccountActivityRequest = getAsyncRequestState(FETCH_ACCOUNT_ACTIVITY)
export const fetchAccountCostsRequest = getAsyncRequestState(FETCH_ACCOUNT_COSTS)
export const fetchDeploymentCostItemsRequest = getAsyncRequestState(FETCH_DEPLOYMENT_COST_ITEMS)
export const fetchAccountDetailsRequest = getAsyncRequestState(FETCH_ACCOUNT_DETAILS)
export const updateAccountEmailRequest = getAsyncRequestState(UPDATE_ACCOUNT_EMAIL)
export const updateAccountPasswordRequest = getAsyncRequestState(UPDATE_ACCOUNT_PASSWORD)
export const updateAccountDetailsRequest = getAsyncRequestState(UPDATE_ACCOUNT_DETAILS)
export const addMonitoringWhitelistEmailRequest = getAsyncRequestState(REQUEST_WHITELISTING)
export const whitelistMonitoringEmailRequest = getAsyncRequestState(WHITELIST)
export const confirmEmailChangeRequest = getAsyncRequestState(CONFIRM_EMAIL_CHANGE)
export const fetchUpdateBillingLevelRequest = getAsyncRequestState(
  UPDATE_BILLING_SUBSCRIPTION_LEVEL,
)
export const fetchUsageDetailsRequest = getAsyncRequestState(FETCH_USAGE_DETAILS)

function makeActivity(payload) {
  return {
    ...payload,
    month_so_far: {
      ...payload.month_so_far,
      clusters: payload.month_so_far.clusters.map((cluster) => ({
        ...cluster,
        cluster: {
          ...cluster.cluster,
          displayName: get(
            cluster.cluster,
            [`data`, `name`],
            cluster.cluster.cluster_id.slice(0, 6),
          ),
        },
      })),
    },
  }
}

function makeDetails(payload) {
  return payload.user
}

function makeProfileFromAccountDetails(payload) {
  if (payload.rules && payload.trials && payload.user && payload.subscription) {
    return { ...payload.rules, trials: payload.trials, ...payload.user, ...payload.subscription }
  }

  return makeDetails(payload)
}

function makeBillingHistory(payload) {
  return payload.invoices
}
