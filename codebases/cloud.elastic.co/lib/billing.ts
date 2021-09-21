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
import { UserProfile } from '../types'

export const getSubscriptionsWithHourlyRates = ({ subscription, activity }) => {
  const hourlyPricesByLevel = get(activity, [`now`, `uplifts`], {})
  const hourlyRate = get(hourlyPricesByLevel[subscription.value], [`aggregated_price`], 0)
  return {
    ...subscription,
    hourlyRate,
  }
}

export const getHourlyRateForLevel = ({ subscription, activity }) => {
  const hourlyPricesByLevel = get(activity, [`now`, `uplifts`], {})
  const hourlyRate = get(hourlyPricesByLevel[subscription], [`aggregated_price`], 0)

  return hourlyRate
}

export const getSubscriptionQuery = (level) => {
  const billingLevels = [`standard`, `gold`, `platinum`, `enterprise`]

  if (billingLevels.includes(level)) {
    return level
  }

  return `standard`
}

export const isElasticStaff = ({ email }) => {
  if (!email) {
    return false
  }

  return email.endsWith(`@elastic.co`)
}

export function isTrialUser(profile: UserProfile): boolean {
  return profile.inTrial
}

export function isTrialNotStartedUser({ inTrial, trials }: UserProfile): boolean {
  return inTrial && !trials.length
}

export function isNotPayingUser(profile: UserProfile): boolean {
  return !profile.invoicable && !profile.is_paying && profile.recurly_billing_info == null
}

export function isTrialOrNotPayingUser(profile: UserProfile): boolean {
  if (isTrialUser(profile)) {
    // always show for trial users
    return true
  }

  // if a user is not in trial and is not yet paying (for whatever reason), we want to show this
  // but only if they don't already have CC details added
  return isNotPayingUser(profile)
}

export function isMonthlyCustomer({ contract_type }: UserProfile): boolean {
  return contract_type === 'monthly'
}

export function isAnnualCustomer({ contract_type }: UserProfile): boolean {
  return contract_type === 'annual'
}

export function isPrepaidConsumptionCustomer({ contract_type }: UserProfile): boolean {
  return contract_type === 'consumption'
}

export function isCreditCardCustomer({ is_paying, recurly_billing_info }: UserProfile): boolean {
  return is_paying && !!recurly_billing_info
}

export function isMonthlyCreditCardCustomer(profile: UserProfile): boolean {
  return isMonthlyCustomer(profile) && isCreditCardCustomer(profile)
}

export function isAnnualCreditCardCustomer(profile: UserProfile): boolean {
  return isAnnualCustomer(profile) && isCreditCardCustomer(profile)
}

export function isPurchaseOrderCustomer({
  is_paying,
  invoicable,
  recurly_billing_info,
  email,
}: UserProfile): boolean {
  return ((is_paying && invoicable) || isElasticStaff({ email })) && !recurly_billing_info
}

export function isMonthlyPurchaseOrderCustomer(profile: UserProfile): boolean {
  return isMonthlyCustomer(profile) && isPurchaseOrderCustomer(profile)
}

export function isAnnualPurchaseOrderCustomer(profile: UserProfile): boolean {
  return isAnnualCustomer(profile) && isPurchaseOrderCustomer(profile)
}
