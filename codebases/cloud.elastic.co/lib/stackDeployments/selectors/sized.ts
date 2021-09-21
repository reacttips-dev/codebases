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

import { getSliderClusterConfigurations } from './topologyElements'
import { isEnabledConfiguration } from '../../deployments/conversion'

import { AnyPayload, AnyTopologyElement, SliderInstanceType } from '../../../types'

export function isSizedSliderResourcePayload({
  resource,
  resourceType,
}: {
  resource: AnyPayload
  resourceType: SliderInstanceType
}): boolean {
  const nodeConfigurations = getSliderClusterConfigurations({
    cluster: resource,
    sliderInstanceType: resourceType,
  })

  return isSizedTopology(nodeConfigurations)
}

function isSizedTopology(nodeConfigurations: AnyTopologyElement[] | undefined): boolean {
  const emptyResource = isEmpty(nodeConfigurations)

  if (emptyResource) {
    return false
  }

  return nodeConfigurations!.some(isEnabledConfiguration)
}
