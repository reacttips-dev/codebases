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

import { getFirstAvailableSliderClusterFromGet } from './available'

import { getSliderDefinition } from '../../../lib/sliders/definitions'

import { getEndpointForResource, GetDeepLinkFn } from '../../../lib/serviceProviderEndpoints'
import { kibanaApmAppUrl } from '../../../lib/serviceProviderDeepLinks'

import { StackDeployment, SliderInstanceType, SliderInstanceDefinition } from '../../../types'

export function getDeploymentResourceEndpoint({
  deployment,
  sliderInstanceType,
  getDeepLink,
  acceptSsoUrl = true,
  ignoreAlias = false,
}: {
  deployment: StackDeployment
  sliderInstanceType: SliderInstanceType
  getDeepLink?: GetDeepLinkFn
  acceptSsoUrl?: boolean
  ignoreAlias?: boolean
}): string {
  const resource = getFirstAvailableSliderClusterFromGet({ deployment, sliderInstanceType })

  if (!resource) {
    return ``
  }

  const useKibanaEndpointInstead = acceptSsoUrl && sliderInstanceType === `apm`

  if (useKibanaEndpointInstead) {
    const kibanaAppEndpoint = kibanaApmAppUrl({ deployment, getDeepLink })

    // fall through to the base case when Kibana is unavailable
    if (kibanaAppEndpoint) {
      return kibanaAppEndpoint
    }
  }

  const endpoint = getEndpointForResource({
    resource,
    resourceType: sliderInstanceType,
    getDeepLink: getSliderDeepLink,
    acceptSsoUrl,
    ignoreAlias,
  })

  return endpoint

  function getSliderDeepLink({ sso }: { sso: boolean }): string | null {
    if (getDeepLink) {
      return getDeepLink({ sso })
    }

    const sliderDefinition = getSliderDefinition({ sliderInstanceType }) as SliderInstanceDefinition
    const { applicationPath, applicationPathWhenUsingSso } = sliderDefinition

    if (sso) {
      return applicationPathWhenUsingSso || null
    }

    return applicationPath || null
  }
}
