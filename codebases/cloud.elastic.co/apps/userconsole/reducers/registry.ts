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

import { getAsyncRequestState } from '../../../reducers/asyncRequests'
import * as actions from '../constants/actions'

export const fetchLogsRequest = getAsyncRequestState(actions.FETCH_LOGS)
export const signUpAwsUserRequest = getAsyncRequestState(actions.SIGN_UP_AWS_USER)
export const signUpGcpUserRequest = getAsyncRequestState(actions.SIGN_UP_GCP_USER)
export const signUpAzureUserRequest = getAsyncRequestState(actions.SIGN_UP_AZURE_USER)
export const verifyAccountRequest = getAsyncRequestState(actions.VERIFY_ACCOUNT)
export const setInitialPasswordRequest = getAsyncRequestState(actions.SET_INITIAL_ACCOUNT_PASSWORD)
export const resendEmailVerificationLinkRequest = getAsyncRequestState(
  actions.RESEND_EMAIL_VERIFICATION_LINK,
)
export const resetPasswordRequest = getAsyncRequestState(actions.RESET_PASSWORD)
export const saveBillingDetailsRequest = getAsyncRequestState(actions.SAVE_BILLING_DETAILS)
export const enrollMfaDeviceRequest = getAsyncRequestState(actions.ENROLL_MFA_DEVICE)
export const activateMfaDeviceRequest = getAsyncRequestState(actions.ACTIVATE_MFA_DEVICE)
export const disableMfaDeviceRequest = getAsyncRequestState(actions.DISABLE_MFA)
export const enableMfaDeviceRequest = getAsyncRequestState(actions.ENABLE_MFA)
export const removeMfaDeviceRequest = getAsyncRequestState(actions.REMOVE_MFA_DEVICE)
export const saveShieldConfigRequest = getAsyncRequestState(actions.SAVE_SHIELD_CONFIG)
export const fetchBasePricesRequest = getAsyncRequestState(actions.FETCH_BASE_PRICES)
export const fetchMetricsRequest = getAsyncRequestState(actions.FETCH_METRICS)
export const createSupportCaseRequest = getAsyncRequestState(actions.CREATE_SUPPORT_CASE)
export const fetchProfileRequest = getAsyncRequestState(actions.FETCH_PROFILE)
export const authorizeSaasOauthTokenRequest = getAsyncRequestState(actions.FETCH_JWT_TOKEN)
export const fetchOktaApplicationsRequest = getAsyncRequestState(actions.FETCH_OKTA_APPLICATIONS)
export const fetchAccountCostOverviewRequest = getAsyncRequestState(
  actions.FETCH_ACCOUNT_COST_OVERVIEW,
)
export const fetchPrepaidBalanceLineItemsRequest = getAsyncRequestState(
  actions.FETCH_PREPAID_BALANCE_LINE_ITEMS,
)
export const fetchAccountCostsRequest = getAsyncRequestState(actions.FETCH_ACCOUNT_COSTS)
export const fetchDeploymentCostItemsRequest = getAsyncRequestState(
  actions.FETCH_DEPLOYMENT_COST_ITEMS,
)
export const fetchDeploymentCostItemsByDeploymentRequest = getAsyncRequestState(
  actions.FETCH_DEPLOYMENT_COST_ITEMS_BY_DEPLOYMENT,
)
