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

import { DeploymentResources } from '../../api/v1/types'
import { isResourceAvailable } from './resources'
import { hasFailedCreatePlan } from './configurationChangeHealth'

import { AnyResourceInfo, SliderInstanceType, StackDeployment } from '../../../types'

export function getFirstAvailableSliderClusterFromGet<TCluster = AnyResourceInfo>({
  deployment,
  sliderInstanceType,
}: {
  deployment: {
    resources: DeploymentResources
  }
  sliderInstanceType: SliderInstanceType
}): TCluster | null {
  const resources = deployment.resources[sliderInstanceType] || []
  const [firstAvailable] = resources.filter(isResourceAvailable)

  return firstAvailable || null
}

export function isDeploymentAvailable(deployment: StackDeployment): boolean {
  const hasNotFailed = !hasFailedCreatePlan({ deployment })

  // We only check ES instead of every instance, as it's the only hard dependency
  const hasEsInstances = deployment.resources.elasticsearch.some(isResourceAvailable)

  return hasNotFailed && hasEsInstances
}
