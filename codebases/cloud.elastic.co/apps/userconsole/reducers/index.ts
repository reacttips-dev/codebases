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

import account from './account'
import { billingDetails, BillingState } from './billing'
import intercom, { State as IntercomState } from './intercom'
import logs from './logs'
import { State as LogsState } from './logs/logTypes'
import metrics from './metrics'
import mfa, { State as MfaState } from './mfa'
import profile, { State as ProfileState } from './profile'
import pricing, { State as PricingState } from './pricing/basePricing'
import elasticSearchServicePrices, {
  ElasticSearchServicePricesState,
} from './pricing/elasticSearchServicePricing'

import { StrictOmit } from '../../../lib/ts-essentials'

import { Action } from '../../../types'

export interface UserconsoleState {
  account: any
  billingDetails: BillingState
  elasticSearchServicePrices: ElasticSearchServicePricesState
  intercom: IntercomState
  logs: LogsState
  metrics: any
  mfa: MfaState
  profile: ProfileState
  pricing: PricingState
}

// This type just checks that for every key in the state interface above,
// the combined reducer also has a reducer key for it.
type UserconsoleReducer = {
  [T in keyof StrictOmit<UserconsoleState, 'profile'>]: (
    // the reducer function takes the current state, or undefined if we're initialising
    state: UserconsoleState[T] | undefined,

    // and the action. Maybe in the future we'll have one mega action definition.
    action: Action<any>,
  ) => UserconsoleState[T]
} & {
  profile: (state: ProfileState, action: any) => ProfileState
}

const userconsoleReducer: UserconsoleReducer = {
  account,
  billingDetails,
  elasticSearchServicePrices,
  intercom,
  logs,
  metrics,
  mfa,
  profile,
  pricing,
}

export default userconsoleReducer

// These exports are specified explicitly because ESLint struggles with exports from a TS file.
// Eventually these can be reverted to wildcard exports again

export {
  default as account,
  getAccountUI,
  getAccountActivity,
  getAccountDetails,
  getBillingHistory,
  getUsageDetails,
  getAccountCosts,
  getAccountCostsOverview,
  getDeploymentItemsCosts,
  getDeploymentItemsCostsByDeployment,
  getPrepaidBalanceLineItems,
  fetchAccountActivityRequest,
  fetchAccountDetailsRequest,
  fetchUsageDetailsRequest,
  updateAccountEmailRequest,
  updateAccountPasswordRequest,
  updateAccountDetailsRequest,
  addMonitoringWhitelistEmailRequest,
  whitelistMonitoringEmailRequest,
  confirmEmailChangeRequest,
  fetchUpdateBillingLevelRequest,
} from './account'

export { getBillingDetails } from './billing/details'
export { getElasticSearchServicePrices } from './pricing/elasticSearchServicePricing'
export { default as logs, getLogs } from './logs'
export { ClusterLogs } from './logs/logTypes'
export { default as metrics, getMetrics } from './metrics'
export { getMfaDevices, getMfaEnabled } from './mfa'

export { getProfile, getExternalSubscription } from './profile'
export { getBasePrices } from './pricing/basePricing'
export * from './registry'
export { getIntercomData } from './intercom'
