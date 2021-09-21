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
  getFirstEsClusterFromGet,
  getSizedTopology,
} from '../stackDeployments/selectors/fundamentals'

import { sortSliderTypes } from './sorting'

import { getProductSliderTypes, doesTopologyIncludeMl } from './support'

import {
  AnySubInfo,
  SliderType,
  SliderInstanceType,
  SliderNodeType,
  StackDeployment,
} from '../../types'

export function isSliderEnabledInStackDeployment(
  deployment: StackDeployment,
  sliderInstanceType: SliderInstanceType,
  sliderNodeType?: SliderNodeType,
): boolean {
  const resource = getFirstEsClusterFromGet({ deployment })

  if (!resource) {
    return false // sanity
  }

  if (sliderInstanceType === `elasticsearch`) {
    if (sliderNodeType === `ml`) {
      const topology = getSizedTopology({ resource })
      return doesTopologyIncludeMl(topology)
    }

    return true
  }

  const associatedClusters: AnySubInfo[] = get(
    resource,
    [`info`, `associated_${sliderInstanceType}_clusters`],
    [],
  )

  return associatedClusters.some(({ enabled }) => enabled)
}

export function getProductSliderTypesForStackDeployment(deployment: StackDeployment): SliderType[] {
  const enabledTypes = getProductSliderTypes().filter(({ sliderInstanceType, sliderNodeType }) =>
    isSliderEnabledInStackDeployment(deployment, sliderInstanceType, sliderNodeType),
  )

  return sortSliderTypes(enabledTypes)
}
