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

import { defineMessages } from 'react-intl'
import { find, flatMap } from 'lodash'

import {
  getDeploymentResourceEndpoint,
  getFirstAvailableSliderClusterFromGet,
  getFirstId,
  getVersion,
  isDeploymentAvailable,
} from '../stackDeployments/selectors'
import { isFleetServerAvailable } from '../stackDeployments/fleet'

import { getSliderPrettyName, getProductSliderTypesForStackDeployment } from '../sliders'

import { SliderInstanceType, SliderType, StackDeployment, LinkInfo } from '../../types'

const messages = defineMessages({
  apm: { id: 'applicationLinks.apm', defaultMessage: 'APM' },
  fleet: { id: 'applicationLinks.fleet', defaultMessage: 'Fleet' },
})

export function getLinks({
  deployment,
  show,
  ignoreAlias = false,
}: {
  deployment: StackDeployment
  show?: SliderInstanceType
  ignoreAlias?: boolean
}): LinkInfo[] {
  const deploymentAvailable = isDeploymentAvailable(deployment)
  const showAll = show === undefined
  const version = getVersion({ deployment })

  const sliderInstanceTypes = getProductSliderTypesForStackDeployment(deployment).filter(
    (sliderType) =>
      !excludeSliderType(sliderType) && (showAll || show === sliderType.sliderInstanceType),
  )

  return flatMap(sliderInstanceTypes, makeLinks)

  function makeLinks({ sliderInstanceType, sliderNodeType }: SliderType): LinkInfo[] {
    const availableResource = getFirstAvailableSliderClusterFromGet({
      deployment,
      sliderInstanceType,
    })
    const apiUri = getDeploymentResourceEndpoint({
      deployment,
      sliderInstanceType,
      acceptSsoUrl: false,
      ignoreAlias,
    })
    const uiUri = getDeploymentResourceEndpoint({ deployment, sliderInstanceType, ignoreAlias })
    const label = getSliderPrettyName({ sliderInstanceType, sliderNodeType, version })
    const appID = availableResource?.id || getFirstId({ deployment, sliderInstanceType }) || ``

    const baseline = {
      appKey: sliderInstanceType,
      appID,
      available: deploymentAvailable && availableResource !== null,
      showLaunchLink: sliderInstanceType !== `elasticsearch`,
    }

    if (sliderInstanceType === `apm` && isFleetServerAvailable({ version })) {
      // UI is just a Kibana deep-link change
      const fleetUiUri = getDeploymentResourceEndpoint({
        deployment,
        sliderInstanceType,
        getDeepLink: () => `/app/fleet#/fleet/agents`,
      })

      // if we are ignoring aliases, we need to synthesise Fleet's URL from APM's.
      const serviceUrls = availableResource?.info.metadata?.services_urls
      const apmApiUri = ignoreAlias ? apiUri : find(serviceUrls, { service: `apm` })?.url
      const fleetApiUri = ignoreAlias
        ? apmApiUri?.replace(`.apm.`, `.fleet.`)
        : find(serviceUrls, { service: `fleet` })?.url

      return [
        {
          ...baseline,
          id: `apm-endpoint`,
          label: messages.apm,
          uiUri,
          apiUri: apmApiUri,
        },
        {
          ...baseline,
          id: `fleet-endpoint`,
          appKey: `fleet`,
          label: messages.fleet,
          uiUri: fleetUiUri,
          apiUri: fleetApiUri,
        },
      ]
    }

    return [
      {
        ...baseline,
        id: `${sliderInstanceType}-endpoint`,
        label,
        uiUri,
        apiUri,
      },
    ]
  }
}

const excludedSliderTypes: SliderType[] = [
  { sliderInstanceType: `elasticsearch`, sliderNodeType: `ml` },
]

function excludeSliderType({ sliderInstanceType, sliderNodeType }: SliderType) {
  return excludedSliderTypes.some(
    (excludedSliderType) =>
      excludedSliderType.sliderInstanceType === sliderInstanceType &&
      excludedSliderType.sliderNodeType === sliderNodeType,
  )
}
