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
import { isEmpty } from 'lodash'
import { stringify } from 'query-string'

import { registerUrl } from '../../lib/urlBuilder'

import { PlainHashMap, BillingSubscriptionLevel } from '../../types'

export const awsBillingUrl = `https://console.aws.amazon.com/billing/home?#/bill`
export const azureBillingUrl = `https://portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/costanalysis`
export const gcpBillingUrl = `https://console.cloud.google.com/billing`
export const gcpConsoleUrl = `https://console.cloud.google.com/marketplace/details/endpoints/elasticsearch-service.gcpmarketplace.elastic.co `

export const contactUs = `https://www.elastic.co/cloud/contact`
export const externalPricing = `https://www.elastic.co/elasticsearch/service/pricing`

export const privacyUrl = `https://www.elastic.co/legal/privacy-statement`
export const termOfService = `https://www.elastic.co/legal/elastic-cloud-account-terms`
export const payingTermsOfService = `https://www.elastic.co/agreements/global/cloud-services-monthly`

export const trainingFaq = `https://www.elastic.co/training/faq`
export const supportFaq = `https://www.elastic.co/support/welcome`
export const supportPortalUrl = `https://support.elastic.co`

export function accountUrl(): string {
  return `/account`
}

export function accountActivityUrl(): string {
  return `/account/activity`
}

export function accountCostAnalysisUrl(): string {
  return `/account/cost-analysis`
}

export function accountContactsUrl(): string {
  return `/account/contacts`
}

export function accountDetailsUrl(): string {
  return `/account/profile`
}

export function accountSecurityUrl(): string {
  return `/account/security`
}

export function accountBillingUrl(): string {
  return `/account/billing`
}

export function accountBillingHistoryUrl(): string {
  return `/account/billing-history`
}

export function apiKeysUrl(): string {
  return `/deployment-features/keys`
}

export function trafficFiltersUrl(): string {
  return `/deployment-features/traffic-filters`
}

export function trustManagementUrl(): string {
  return `/deployment-features/trust-management`
}

export function pricingUrl({ level }: { level?: BillingSubscriptionLevel }): string {
  const baseUrl = `/pricing`

  if (!level) {
    return baseUrl
  }

  const queryString = stringify({
    level,
  })
  const pricingUrl = `${baseUrl}?${queryString}`
  return pricingUrl
}

export function signUp(queryStringParams: PlainHashMap = {}): string {
  const baseUrl = registerUrl()

  if (isEmpty(queryStringParams)) {
    return baseUrl
  }

  const queryString = stringify(queryStringParams)
  const signUpUrl = `${baseUrl}?${queryString}`

  return signUpUrl
}
