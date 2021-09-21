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

import { getSupportedSliderInstanceTypes } from '../sliders/support'

import { AnyPayload, AnyTopologyElement, SliderInstanceType } from '../../types'
import {
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
  ElasticsearchClusterTopologyElement,
} from '../api/v1/types'

export function getTopologiesFromTemplate(args: {
  deploymentTemplate: DeploymentCreateRequest | DeploymentUpdateRequest
  sliderInstanceType: `elasticsearch`
}): ElasticsearchClusterTopologyElement[]
export function getTopologiesFromTemplate(args: {
  deploymentTemplate: DeploymentCreateRequest | DeploymentUpdateRequest
  sliderInstanceType?: SliderInstanceType
}): AnyTopologyElement[]
export function getTopologiesFromTemplate({
  deploymentTemplate,
  sliderInstanceType,
}: {
  deploymentTemplate: DeploymentCreateRequest | DeploymentUpdateRequest
  sliderInstanceType?: SliderInstanceType
}): AnyTopologyElement[] {
  const topologies: AnyTopologyElement[] = []

  getSupportedSliderInstanceTypes()
    // restrict to the requested type from the argument, if provided
    .filter((x) => !sliderInstanceType || x === sliderInstanceType)
    .filter((x) => deploymentTemplate.resources![x])
    .forEach((x) => {
      for (const payload of deploymentTemplate.resources![x] as AnyPayload[]) {
        if (payload.plan.cluster_topology) {
          topologies.push(...payload.plan.cluster_topology)
        }
      }
    })

  return topologies
}
