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

import { isEmpty, filter, sortBy } from 'lodash'
import moment from 'moment'

import { FETCH_PROFILE, FETCH_OKTA_APPLICATIONS } from '../../constants/actions'

import { ProfileState, ReduxState, UserProfile, UserSubscription } from '../../../../types'

import { FetchProfileAction, FetchOktaApplicationsAction } from './profileTypes'

export type State = ProfileState

export default function profileReducer(
  state: State = null,
  action: FetchProfileAction | FetchOktaApplicationsAction,
): State {
  if (action.type === FETCH_PROFILE) {
    if (!action.error && action.payload) {
      const { user } = action.payload
      const { level } = user
      const trialContext = getTrialContext(user)
      const oktaApplications = state ? state.oktaApplications : []
      const isPremium = level !== `standard` && !trialContext.inTrial

      return {
        ...user,
        ...trialContext,
        oktaApplications,
        isPremium,
        level,
        canUploadPlugins: (user.allow_plugins || user.allow_bundles) === true,
        allow_plugins: user.allow_plugins,
        allow_bundles: user.allow_bundles,
      }
    }
  }

  if (action.type === FETCH_OKTA_APPLICATIONS) {
    if (!action.error && action.payload) {
      const { applications } = action.payload

      return {
        ...state!,
        oktaApplications: applications,
      }
    }
  }

  return state
}

/**
 * Note about trials.
 * All users start off as trial users.
 * There is a `trials` property that is an array. A paying user or a new (non-expired) trial will have this array be
 * empty. However, an expired trial or one that has been extended will be populated with at least one object. This object
 * has the trial start/end dates and a type. The type seems to always be `elasticsearch`. So even though this is an array
 * we just find the first `elasticsearch` type trial and use the end date to confirm that they have either an expired
 * trial or have been extended.
 */
function getTrialContext(user: UserProfile) {
  const { trials, trial_length = 14 } = user
  const inTrial = user.is_trial
  const currentTrial = getCurrentTrial(user)
  const isTrialExpired = hasExpiredTrial(user)
  const canRestartTrial = hasRestartableTrial(user)
  const canExtendTrial = !!user.can_request_trial_extension
  const trialDaysRemaining = calculateTrialDaysRemaining(user)

  return {
    trials,
    trial_length,
    inTrial,
    hasExpiredTrial: isTrialExpired,
    canRestartTrial,
    canExtendTrial,
    currentTrial,
    trialDaysRemaining,
  }
}

function getCurrentTrial(user: UserProfile) {
  return sortBy(user.trials, (trial) => trial.end)[user.trials.length - 1] || null
}

function calculateTrialDaysRemaining(user): number | undefined {
  const expired = hasExpiredTrial(user)

  if (expired) {
    return user.is_trial ? 0 : undefined
  }

  const currentTrial = getCurrentTrial(user)

  if (!currentTrial) {
    return undefined
  }

  const end = moment(currentTrial.end)
  const date = moment().startOf('day')
  const duration = moment.duration(end.diff(date))
  return Math.floor(duration.asDays())
}

function hasExpiredTrial(user: UserProfile): boolean {
  if (!user.is_trial) {
    return false
  }

  const trials = filter(user.trials, (trial) => trial.type === `elasticsearch`)

  if (isEmpty(trials)) {
    return false
  }

  // Users can have more than one trial, so we need to grab the most recent
  const currentTrial = getCurrentTrial(user)
  const ended = moment().isAfter(currentTrial.end)

  return ended
}

function hasRestartableTrial(user: UserProfile): boolean {
  if (!user.trials || user.trials.length < 1) {
    return false
  }

  const isTrialExpired = hasExpiredTrial(user)
  const currentTrial = getCurrentTrial(user)
  return isTrialExpired && Boolean(currentTrial.restartable)
}

export function getProfile(state: ReduxState): State {
  const profile = state.profile

  if (!profile && window != null && window.location.pathname.toLowerCase().startsWith('/pricing')) {
    return getLoggedOutPublicPricingPageProfile()
  }

  return profile
}

export function getExternalSubscription({ profile }): UserSubscription {
  if (!profile) {
    return null
  }

  if (profile.domain === `found`) {
    return null
  }

  return profile.domain
}

function getLoggedOutPublicPricingPageProfile(): State {
  return {
    allow_bundles: false,
    allow_plugins: false,
    allow_provisioning_without_payment_established: false,
    aws_subscribed: false,
    can_request_trial_extension: false,
    capacity_limit: -1,
    contract_type: `monthly`,
    created: ``,
    credit_limit: -1,
    data: {},
    domain: `found`,
    email: ``,
    gcp_subscribed: false,
    gravatar: ``,
    invoicable: false,
    is_paying: true,
    is_profile_editable: false,
    is_trial: false,
    last_modified: ``,
    level: `standard`,
    trials: [],
    txid: -1,
    user_id: -1,
    wants_informational_emails: false,
    integrated_marketplace_account: false,

    // Calculated properties
    canExtendTrial: false,
    canRestartTrial: false,
    canUploadPlugins: false,
    hasExpiredTrial: false,
    inTrial: false,
    isPremium: false,
  }
}
