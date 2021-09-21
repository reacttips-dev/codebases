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

import asyncRequest, { resetAsyncRequest } from '../../../../actions/asyncRequests'
import history from '../../../../lib/history'
import { loginUrl } from '../../../../lib/urlBuilder'
import {
  getCostsDeploymentsUrl,
  getCostsOverviewUrl,
  getCostsItemsUrl,
  getCostsItemsByDeploymentUrl,
  getUsersUrl,
  getConsumptionLineItemsUrl,
} from '../../../../lib/api/v1/urls'

import {
  fetchPrepaidBalanceLineItemsRequest,
  fetchAccountCostOverviewRequest,
  fetchAccountDetailsRequest,
  getAccountCostsOverview,
  getPrepaidBalanceLineItems,
  getAccountDetails,
} from '../../reducers'

import {
  CLEAR_EMAIL_CHANGE_CONFIRMATION,
  CONFIRM_EMAIL_CHANGE,
  FETCH_ACCOUNT_ACTIVITY,
  FETCH_ACCOUNT_COSTS,
  FETCH_PREPAID_BALANCE_LINE_ITEMS,
  FETCH_ACCOUNT_COST_OVERVIEW,
  FETCH_DEPLOYMENT_COST_ITEMS,
  FETCH_DEPLOYMENT_COST_ITEMS_BY_DEPLOYMENT,
  FETCH_ACCOUNT_DETAILS,
  FETCH_BILLING_HISTORY,
  REQUEST_WHITELISTING,
  RESEND_EMAIL_VERIFICATION_LINK,
  RESET_PASSWORD,
  SET_INITIAL_ACCOUNT_PASSWORD,
  UPDATE_ACCOUNT_DETAILS,
  UPDATE_ACCOUNT_EMAIL,
  UPDATE_BILLING_SUBSCRIPTION_LEVEL,
  UPDATE_ACCOUNT_PASSWORD,
  UPDATE_CONTACTS,
  VERIFY_ACCOUNT,
  WHITELIST,
} from '../../constants/actions'
import { saveToken } from '../../../../actions/auth'
import { fetchProfile } from '../profile'
import { loginAndRedirect } from '../auth'
import { isFeatureActivated } from '../../../../store'

import Feature from '../../../../lib/feature'
import { browserEnv } from '../../../../lib/browserEnv'

import {
  ReduxState,
  ThunkAction,
  BillingSubscriptionLevel,
  AccountCostTimePeriod,
} from '../../../../types'

function shouldFetchPrepaidBalanceLineItems(state: ReduxState): boolean {
  const prepaidBalanceLineItemsRequest = fetchPrepaidBalanceLineItemsRequest(state)

  if (prepaidBalanceLineItemsRequest.inProgress) {
    return false
  }

  return !getPrepaidBalanceLineItems(state)
}

export function fetchPrepaidBalanceLineItemsIfNeeded(): ThunkAction<Promise<any>> {
  return (dispatch, getState) => {
    if (!shouldFetchPrepaidBalanceLineItems(getState())) {
      return Promise.resolve()
    }

    return dispatch(fetchPrepaidBalanceLineItems())
  }
}

export function fetchPrepaidBalanceLineItems(): ThunkAction<Promise<any>> {
  const url = getConsumptionLineItemsUrl()

  return asyncRequest({
    type: FETCH_PREPAID_BALANCE_LINE_ITEMS,
    url,
  })
}

function shouldFetchAccountCostOverview(state: ReduxState): boolean {
  const accountCostOverviewRequest = fetchAccountCostOverviewRequest(state)

  if (accountCostOverviewRequest.inProgress) {
    return false
  }

  return !getAccountCostsOverview(state)
}

export function fetchAccountCostOverviewIfNeeded({
  organizationId,
}: {
  organizationId: string
}): ThunkAction<Promise<any>> {
  return (dispatch, getState) => {
    if (!shouldFetchAccountCostOverview(getState())) {
      return Promise.resolve()
    }

    return dispatch(fetchAccountCostOverview({ organizationId }))
  }
}

export function fetchAccountCostOverview({
  organizationId,
}: {
  organizationId: string
}): ThunkAction<Promise<any>> {
  const url = getCostsOverviewUrl({ organizationId })

  return asyncRequest({
    type: FETCH_ACCOUNT_COST_OVERVIEW,
    url,
  })
}

export function fetchAccountCosts({
  organizationId,
  timePeriod,
}: {
  organizationId: string
  timePeriod: AccountCostTimePeriod
}): ThunkAction<Promise<any>> {
  const { from, to } = timePeriod
  const url = getCostsDeploymentsUrl({
    organizationId,
    from: from.toISOString(),
    to: to.toISOString(),
  })

  return asyncRequest({
    type: FETCH_ACCOUNT_COSTS,
    url,
    meta: { timePeriod },
  })
}

export function fetchDeploymentCostItems({
  organizationId,
  timePeriod,
}: {
  organizationId: string
  timePeriod: AccountCostTimePeriod
}): ThunkAction<Promise<any>> {
  const { from, to } = timePeriod
  const url = getCostsItemsUrl({
    organizationId,
    from: from.toISOString(),
    to: to.toISOString(),
  })

  return asyncRequest({
    type: FETCH_DEPLOYMENT_COST_ITEMS,
    url,
    meta: { timePeriod },
  })
}

export function fetchDeploymentCostItemsByDeployment({
  timePeriod,
  deploymentId,
  organizationId,
}: {
  timePeriod: AccountCostTimePeriod
  deploymentId: string
  organizationId: string
}): ThunkAction<Promise<any>> {
  const { from, to } = timePeriod
  const url = getCostsItemsByDeploymentUrl({
    from: from.toISOString(),
    to: to.toISOString(),
    organizationId,
    deploymentId,
  })

  return asyncRequest({
    type: FETCH_DEPLOYMENT_COST_ITEMS_BY_DEPLOYMENT,
    url,
  })
}

export function fetchAccountActivity(): ThunkAction<Promise<any>> {
  const url = `/api/v0/billing/_current`

  return asyncRequest({
    type: FETCH_ACCOUNT_ACTIVITY,
    url,
  })
}

function shouldFetchAccountDetails(state: ReduxState) {
  const accountRequest = fetchAccountDetailsRequest(state)

  if (accountRequest.inProgress) {
    return false
  }

  return !getAccountDetails(state)
}

export function fetchAccountDetailsIfNeeded(): ThunkAction<Promise<any>> {
  return (dispatch, getState) => {
    if (!shouldFetchAccountDetails(getState())) {
      return Promise.resolve()
    }

    return dispatch(fetchAccountDetails())
  }
}

export function fetchAccountDetails() {
  const url = getUsersUrl()

  return asyncRequest({
    type: FETCH_ACCOUNT_DETAILS,
    url,
  })
}

export function fetchBillingHistory() {
  const url = `/api/v0/invoices`

  return asyncRequest({
    type: FETCH_BILLING_HISTORY,
    url,
  })
}

export function updateAccountEmail({
  newEmail,
  oldEmail,
  password,
}: {
  newEmail: string
  oldEmail: string
  password: string
}) {
  const url = `/api/v0/users/_change_email`

  const payload = {
    new: newEmail,
    old: oldEmail,
    password,
  }

  return asyncRequest({
    type: UPDATE_ACCOUNT_EMAIL,
    method: `POST`,
    url,
    payload,
    meta: { newEmail },
  })
}

export function updateAccountPassword({
  oldPassword,
  newPassword,
  email,
}: {
  oldPassword: string
  newPassword: string
  email: string
}) {
  const url = `/api/v1/users/_password`

  const payload = {
    new: newPassword,
    old: oldPassword,
    email,
  }

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: UPDATE_ACCOUNT_PASSWORD,
        method: `POST`,
        url,
        payload,
      }),
    ).then((resp) => {
      const { token } = resp.payload

      if (token) {
        dispatch(saveToken(token))
      }

      return resp
    })
}

export function updateAccountDetails(accountDetails: unknown) {
  const url = isFeatureActivated(Feature.cloudPortalEnabled)
    ? `/api/v1/users/profile`
    : `/api/v0/users`

  return asyncRequest({
    type: UPDATE_ACCOUNT_DETAILS,
    method: `PUT`,
    url,
    payload: accountDetails,
  })
}

export function updateContacts(accountDetails: unknown) {
  // Contacts were previously handled by updateAccountDetails, but the v0 endpoint
  // needs to be used as the v1/users/profile will return a 403
  const url = `/api/v0/users`

  return asyncRequest({
    type: UPDATE_CONTACTS,
    method: `PUT`,
    url,
    payload: accountDetails,
  })
}

export function confirmEmailChange(email: string, newEmail: string, expires: number, hash: string) {
  const url = `/api/v1/users/_verify_email_change`
  const payload = {
    email,
    new: newEmail,
    e: expires.toString(10),
    h: hash,
  }

  return asyncRequest({
    type: CONFIRM_EMAIL_CHANGE,
    method: `POST`,
    url,
    payload,
    handleUnauthorized: true, // invalid tokens return 401
  })
}

export function clearEmailChangeConfirmation() {
  return {
    type: CLEAR_EMAIL_CHANGE_CONFIRMATION,
  }
}

export function verifyAccount(email: string, expires: number, hash: string) {
  const url = `/api/v1/users/_verify`
  const payload = {
    email,
    e: expires.toString(10),
    h: hash,
  }

  return asyncRequest({
    type: VERIFY_ACCOUNT,
    method: `POST`,
    url,
    payload,
    handleUnauthorized: true, // invalid tokens return 401
  })
}

export function setInitialPassword({
  email,
  expires,
  hash,
  password,
  redirectTo = '/',
}: {
  email: string
  expires: number
  hash: string
  password: string
  redirectTo?: string
}): ThunkAction {
  const url = `/api/v1/users/_password`

  const payload = {
    email,
    e: expires.toString(10),
    h: hash,
    new: password,
  }

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: SET_INITIAL_ACCOUNT_PASSWORD,
        method: `POST`,
        url,
        payload,
        handleUnauthorized: true,
      }),
    )
      .then(() =>
        dispatch(
          loginAndRedirect({
            credentials: { username: email, password },
            redirectTo,
          }),
        ),
      )
      .then(({ mfa_required }) =>
        // if MFA is enabled, they need to be on the login page for that to be handled
        mfa_required ? history.push(loginUrl()) : null,
      )
}

export function saveMonitoringEmailWhitelist(email: string) {
  const url = `/api/v0/watcher/_request_whitelisting`
  const payload = {
    email,
  }

  return asyncRequest({
    type: REQUEST_WHITELISTING,
    method: `POST`,
    url,
    payload,
  })
}

export function whitelistMonitoringEmail(email: string, expires: number, hash: string) {
  const url = `/api/v0/watcher/_whitelist`
  const payload = {
    email,
    e: expires.toString(10),
    h: hash,
  }

  return asyncRequest({
    type: WHITELIST,
    method: `POST`,
    url,
    payload,
  })
}

export function resetPassword(email: string) {
  const url = `/api/v1/saas/user/_reset-password`
  const payload = {
    email,
  }

  return asyncRequest({
    type: RESET_PASSWORD,
    method: `POST`,
    url,
    payload,
  })
}

export function resendEmailVerificationLink(email: string) {
  const url = `/api/v1/user/_resend_verification`
  const payload = {
    email,
  }

  return asyncRequest({
    type: RESEND_EMAIL_VERIFICATION_LINK,
    method: `POST`,
    url,
    payload,
  })
}

export function updateBillingLevel({ level }: { level: BillingSubscriptionLevel }) {
  const url = `/api/v1/saas/users/_subscription_level`
  const payload = {
    ...browserEnv(),
    level,
  }

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: UPDATE_BILLING_SUBSCRIPTION_LEVEL,
        method: `POST`,
        url,
        payload,
      }),
    ).then(() => dispatch(fetchProfile()))
}

export const resetUpdateAccountEmailRequest = () => resetAsyncRequest(UPDATE_ACCOUNT_EMAIL)
export const resetUpdateAccountPasswordRequest = () => resetAsyncRequest(UPDATE_ACCOUNT_PASSWORD)
export const resetUpdateAccountDetailsRequest = () => resetAsyncRequest(UPDATE_ACCOUNT_DETAILS)
export const resetSaveMonitoringEmailWhitelist = () => resetAsyncRequest(REQUEST_WHITELISTING)
export const resetPasswordResetRequest = () => resetAsyncRequest(RESET_PASSWORD)
export const resetEmailVerificationLinkRequest = () =>
  resetAsyncRequest(RESEND_EMAIL_VERIFICATION_LINK)
export const resetUpdateBillingLevel = () => resetAsyncRequest(UPDATE_BILLING_SUBSCRIPTION_LEVEL)
export const resetFetchDeploymentCostItemsRequest = () =>
  resetAsyncRequest(FETCH_DEPLOYMENT_COST_ITEMS)
