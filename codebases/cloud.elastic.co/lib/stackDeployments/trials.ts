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

import { find } from 'lodash'

import { getDeploymentNodeConfigurations } from './selectors'
import { getSliderTrialLimit } from '../sliders'
import {
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
  InstanceConfiguration,
} from '../api/v1/types'
import { AnyTopologyElement } from '../../types'
import { getSize } from '../deployments/conversion'

export function ensureSatisfiesTrialConstraints({
  deployment,
  instanceConfigurations,
  inTrial,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  instanceConfigurations: InstanceConfiguration[]
  inTrial?: boolean
}) {
  if (!inTrial) {
    return
  }

  const nodeConfigurations = getDeploymentNodeConfigurations({ deployment })
  nodeConfigurations.forEach((nodeConfiguration) => {
    // grab the threshold for this instance config
    const instanceConfiguration = find(instanceConfigurations, {
      id: nodeConfiguration.instance_configuration_id,
    })

    if (instanceConfiguration == null) {
      return
    }

    const trialThreshold = getSliderTrialLimit({
      inTrial,
      sliderInstanceType: instanceConfiguration.instance_type,
      sliderNodeTypes: instanceConfiguration.node_types,
    })

    if (trialThreshold == null) {
      return
    }

    // cap any values that have exceeded the limit
    if (
      nodeConfiguration.size &&
      nodeConfiguration.size.resource === `memory` &&
      nodeConfiguration.size.value > trialThreshold.memorySize
    ) {
      nodeConfiguration.size.value = trialThreshold.memorySize
    }

    if (nodeConfiguration.zone_count && nodeConfiguration.zone_count > trialThreshold.zoneCount) {
      nodeConfiguration.zone_count = trialThreshold.zoneCount
    }
  })
}

export function exceededTrialNodes({
  deployment,
  instanceConfigurations,
  inTrial,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  instanceConfigurations: InstanceConfiguration[] | undefined
  inTrial?: boolean
}): AnyTopologyElement[] {
  if (!inTrial || !instanceConfigurations) {
    return []
  }

  const nodeConfigurations = getDeploymentNodeConfigurations({ deployment })
  const exceededConfigurations = nodeConfigurations.map(getExceededNode).filter(Boolean)

  // @ts-ignore
  return exceededConfigurations

  function getExceededNode(nodeConfiguration: AnyTopologyElement): AnyTopologyElement | null {
    // grab the limit for this instance config
    const instanceConfiguration = find(instanceConfigurations, {
      id: nodeConfiguration.instance_configuration_id,
    })

    if (instanceConfiguration == null) {
      return null
    }

    const trialThreshold = getSliderTrialLimit({
      inTrial,
      sliderInstanceType: instanceConfiguration.instance_type,
      sliderNodeTypes: instanceConfiguration.node_types,
    })

    if (trialThreshold == null) {
      return null
    }

    const nodeConfigurationMemorySize = getSize({
      resource: `memory`,
      instanceConfiguration,
      size: nodeConfiguration.size,
    })

    const exceededSize = nodeConfigurationMemorySize > trialThreshold.memorySize
    const exceededZoneCount =
      nodeConfiguration.zone_count && nodeConfiguration.zone_count > trialThreshold.zoneCount

    if (!exceededSize && !exceededZoneCount) {
      return null
    }

    const exceededNode: AnyTopologyElement = {
      instance_configuration_id: nodeConfiguration.instance_configuration_id,
    }

    if (exceededSize) {
      exceededNode.size = nodeConfiguration.size
    }

    if (exceededZoneCount) {
      exceededNode.zone_count = nodeConfiguration.zone_count
    }

    return exceededNode
  }
}
