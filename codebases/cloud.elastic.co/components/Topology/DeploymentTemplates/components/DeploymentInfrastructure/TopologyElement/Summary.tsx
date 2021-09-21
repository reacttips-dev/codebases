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

import React, { Fragment } from 'react'

import { EuiText, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import FrozenSizingPopover from './SizePicker/FrozenSizingPopover'

import { getKeys, getNumber, getCpu } from './helpers'

import prettySize from '../../../../../../lib/prettySize'
import { getSliderNodeTypeForTopologyElement } from '../../../../../../lib/stackDeployments'

import { InstanceConfiguration } from '../../../../../../lib/api/v1/types'
import { AnyTopologyElementWithNodeRoles, SliderInstanceType } from '../../../../../../types'
export interface Props {
  zoneCount: number
  autoscalingMin?: number
  isMachineLearning?: boolean
  isFrozen?: boolean
  size: number
  resource: 'storage' | 'memory'
  storageMultiplier?: number
  cpuMultiplier?: number
  maxSize: number
  sliderInstanceType: SliderInstanceType
  instanceConfiguraton: InstanceConfiguration
  topologyElement: AnyTopologyElementWithNodeRoles
}

const Summary: React.FunctionComponent<Props> = ({
  size,
  resource: instanceResource,
  storageMultiplier,
  cpuMultiplier,
  zoneCount,
  maxSize,
  isMachineLearning,
  isFrozen,
  autoscalingMin,
  sliderInstanceType,
  topologyElement,
}) => {
  const sliderNodeType = getSliderNodeTypeForTopologyElement({ topologyElement })
  const { primaryKey, secondaryKey } = getKeys({
    sliderNodeType,
    sliderInstanceType,
    instanceResource,
    storageMultiplier,
  })
  const keyLabels = {
    memory: `RAM`,
    storage: `storage`,
    cpu: `vCPU`,
  }
  const displaySize = getDisplaySize({
    autoscalingMin,
    maxSize,
    size,
    isMachineLearning,
  })
  const primaryText = `${prettySize(
    getNumber({
      instanceResource,
      storageMultiplier,
      totalSize: displaySize * zoneCount,
      resourceType: primaryKey,
      isBlobStorage: isFrozen,
    }),
  )} ${keyLabels[primaryKey]}`
  const secondaryText = secondaryKey
    ? `${prettySize(
        getNumber({
          instanceResource,
          storageMultiplier,
          totalSize: displaySize * zoneCount,
          resourceType: secondaryKey,
        }),
      )} ${keyLabels[secondaryKey]}`
    : ``

  const cpuText = cpuMultiplier
    ? `${getCpu({ cpuMultiplier, totalSize: displaySize, zoneCount })} ${keyLabels.cpu}`
    : ``

  return (
    <div>
      <EuiFlexGroup gutterSize='s' responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiText size='s'>{primaryText}</EuiText>
        </EuiFlexItem>
        {secondaryKey && (
          <Fragment>
            <EuiFlexItem grow={false}>
              <EuiText size='s' color='subdued'>
                &#124;
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiText size='s'>{secondaryText}</EuiText>
            </EuiFlexItem>
          </Fragment>
        )}
        {cpuMultiplier && (
          <Fragment>
            <EuiFlexItem grow={false}>
              <EuiText size='s' color='subdued'>
                &#124;
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiText size='s'>{cpuText}</EuiText>
            </EuiFlexItem>
          </Fragment>
        )}
        {isFrozen && (
          <FrozenSizingPopover
            primaryKey={primaryKey}
            instanceResource={instanceResource}
            storageMultiplier={storageMultiplier}
            size={size}
          />
        )}
      </EuiFlexGroup>
    </div>
  )
}

function getDisplaySize({ autoscalingMin, maxSize, size, isMachineLearning }) {
  const showMachineLearningAutoscaleMinForSize =
    isMachineLearning && autoscalingMin! > 0 && (size === 0 || !isFinite(size))

  // Show size as actual size from the API if:
  // a) this isn't machine learning
  // OR
  // b) it is machine learning, and has a non-zero size already, and the user has selected an autoscalingMin greater than 0
  if (!showMachineLearningAutoscaleMinForSize) {
    return size
  }

  // Show size as autoscalingMin in the case that the user has just set
  // the min to greater than 0, so the API still has size: 0
  // We do this because we never send size in the request for ML, so don't
  // want to update it or track it, but do want to communicate to the user
  // that they will effectively be turning ML on
  if (autoscalingMin! > maxSize) {
    const displaySize = maxSize

    return displaySize
  }

  return autoscalingMin
}

export default Summary
