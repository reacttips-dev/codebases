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

import React from 'react'
import { EuiCallOut } from '@elastic/eui'
import { FormattedMessage } from 'react-intl'

import { isEnabledConfiguration } from '../../../../../../lib/deployments/conversion'
import {
  isDedicatedMaster,
  isDedicatedIngest,
  isDedicatedML,
  isAutoscaleableTier,
  getFirstEsCluster,
} from '../../../../../../lib/stackDeployments'
import { getApmMode, ApmMode } from '../../../../../../lib/apmClusters/getApmMode'

import DedicatedIngest from './DedicatedIngest'
import DedicatedMaster from './DedicatedMaster'
import ZeroSizedAutoscalingTopologyElement from './ZeroSizedAutoscalingTopologyElement'
import TopologyElement, { AllProps as TopologyElementProps } from './TopologyElement'
import DisabledTopologyElement from './DisabledTopologyElement'

import { ElasticsearchClusterTopologyElement } from '../../../../../../lib/api/v1/types'

const TopologyElementRouter: React.FunctionComponent<TopologyElementProps> = (props) => {
  const {
    deploymentUnderEdit,
    sliderInstanceType,
    topologyElement,
    dedicatedMasterThreshold,
    instanceConfiguration,
    subscription,
    isAutoscalingEnabled,
    deployment,
  } = props

  const isAwsm = subscription === `aws`

  if (!instanceConfiguration) {
    if (isAwsm) {
      return null
    }

    return (
      <EuiCallOut color='warning'>
        <FormattedMessage
          id='topologyElement-error'
          defaultMessage='Something went wrong with rendering this element. Please contact support.'
        />
      </EuiCallOut>
    )
  }

  if (isDedicatedIngest({ topologyElement })) {
    return <DedicatedIngest {...props} />
  }

  if (isDedicatedMaster({ topologyElement })) {
    return <DedicatedMaster {...props} dedicatedMasterThreshold={dedicatedMasterThreshold} />
  }

  if (!isEnabledConfiguration(topologyElement)) {
    if (isAutoscalingEnabled) {
      if (isDedicatedML({ topologyElement })) {
        const mlTopologyElement = topologyElement as ElasticsearchClusterTopologyElement

        if (mlTopologyElement.autoscaling_min!.value > 0) {
          return <TopologyElement {...props} />
        }
      }

      const esResource = getFirstEsCluster({ deployment })
      const version = esResource?.plan.elasticsearch.version

      if (isAutoscaleableTier({ topologyElement, version })) {
        return (
          <ZeroSizedAutoscalingTopologyElement
            {...props}
            topologyElement={topologyElement as ElasticsearchClusterTopologyElement}
          />
        )
      }
    }

    return <DisabledTopologyElement {...props} />
  }

  if (sliderInstanceType === `apm`) {
    if (getApmMode({ deployment: deploymentUnderEdit }) === ApmMode.Managed) {
      return <TopologyElement {...props} showUserSettings={false} />
    }
  }

  return <TopologyElement {...props} />
}

export default TopologyElementRouter
