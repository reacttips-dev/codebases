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
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiText, EuiTitle } from '@elastic/eui'

import prettySize from '../../../../../../lib/prettySize'
import { getSliderDefinition, getTopologyElementName } from '../../../../../../lib/sliders'
import { isData, getSliderNodeTypeForTopologyElement } from '../../../../../../lib/stackDeployments'

import { AnyTopologyElement, VersionNumber } from '../../../../../../types'
import { InstanceConfiguration } from '../../../../../../lib/api/v1/types'

export const blobStorageMultiplier = 1600

export const TopologyElementName: React.FunctionComponent<{
  topologyElement: AnyTopologyElement
  instanceConfiguration: InstanceConfiguration
  version: VersionNumber | null
}> = ({ topologyElement, instanceConfiguration, version }) => {
  const sliderInstanceType = instanceConfiguration.instance_type

  const sliderName = getTopologyElementName({ sliderInstanceType, topologyElement, version })

  return (
    <FormattedMessage
      id='deploymentInfrastructure-topologyElement-name'
      defaultMessage='{sliderName} {instanceNoun}'
      values={{
        sliderName,
        instanceNoun: isData({ topologyElement }) ? (
          <FormattedMessage
            id='deploymentInfrastructure-topologyElement-tier'
            defaultMessage='tier'
          />
        ) : (
          <FormattedMessage
            id='deploymentInfrastructure-topologyElement-nodes'
            defaultMessage='nodes'
          />
        ),
      }}
    />
  )
}

interface TopologyElementTitleProps extends WrappedComponentProps {
  topologyElement: AnyTopologyElement
  instanceConfiguration: InstanceConfiguration
  version: VersionNumber | null
}

const TopologyElementTitleToInject: React.FunctionComponent<TopologyElementTitleProps> = ({
  topologyElement,
  instanceConfiguration,
  version,
}) => (
  <EuiTitle size='xs'>
    <h2>
      <TopologyElementName
        topologyElement={topologyElement}
        instanceConfiguration={instanceConfiguration}
        version={version}
      />
    </h2>
  </EuiTitle>
)

export const TopologyElementTitle = injectIntl(TopologyElementTitleToInject)

export const TopologyElementDescription: React.FunctionComponent<{
  topologyElement: AnyTopologyElement
  instanceConfiguration: InstanceConfiguration
  descriptionOverride?: React.ReactNode
  version: VersionNumber | null
}> = ({ topologyElement, instanceConfiguration, descriptionOverride, version }) => {
  if (descriptionOverride) {
    return (
      <EuiText color='subdued' size='s'>
        {descriptionOverride}
      </EuiText>
    )
  }

  const sliderInstanceType = instanceConfiguration.instance_type

  const sliderNodeType = getSliderNodeTypeForTopologyElement({ topologyElement })

  const definition = getSliderDefinition({ sliderInstanceType, sliderNodeType, version })

  const description = <FormattedMessage {...definition.messages.instanceConfigurationDescription} />

  return (
    <EuiText color='subdued' size='s'>
      {description}
    </EuiText>
  )
}

export function getKeys({
  sliderInstanceType,
  instanceResource,
  storageMultiplier,
  sliderNodeType,
}) {
  // always render memory for storage-specified sizes
  if (instanceResource === `storage`) {
    return {
      primaryKey: `storage`,
      secondaryKey: `memory`,
    }
  }

  const showStorage = isStorageRelevant({
    sliderNodeType,
    sliderInstanceType,
  })

  if (instanceResource === `memory` && storageMultiplier && showStorage) {
    return {
      primaryKey: `storage`,
      secondaryKey: `memory`,
    }
  }

  // otherwise memory is the only relevant thing
  return {
    primaryKey: `memory`,
  }
}

export function getNumber({
  instanceResource,
  storageMultiplier,
  totalSize,
  resourceType,
  isBlobStorage = false,
}) {
  if (resourceType === instanceResource) {
    return totalSize
  }

  if (resourceType === `memory` && storageMultiplier) {
    return totalSize / storageMultiplier
  }

  if (resourceType === `storage` && storageMultiplier) {
    if (isBlobStorage) {
      return totalSize * blobStorageMultiplier
    }

    return totalSize * storageMultiplier
  }

  return
}

function isStorageRelevant({ sliderInstanceType, sliderNodeType }) {
  if (!sliderInstanceType) {
    return true
  }

  // We don't care about storage for these instances
  if (
    sliderInstanceType === `kibana` ||
    sliderInstanceType === `apm` ||
    sliderInstanceType === `enterprise_search` ||
    sliderInstanceType === `appsearch`
  ) {
    return false
  }

  if (sliderNodeType === `ml` || sliderNodeType === `ingest` || sliderNodeType === `master`) {
    return false
  }

  // If all else fails, showing more information is best
  return true
}

export function getCpu({
  cpuMultiplier,
  totalSize,
  zoneCount,
}: {
  cpuMultiplier: number
  totalSize: number
  zoneCount?: number
}) {
  // Calculate boosted CPU values for instances <= 8GB
  if (totalSize <= 8192) {
    const cpuValuePerZone = Math.round(16 * cpuMultiplier * 10) / 10

    if (zoneCount) {
      const totalCpuValue = Math.round(cpuValuePerZone * zoneCount * 10) / 10
      return `Up to ${totalCpuValue}`
    }

    return `Up to ${cpuValuePerZone}`
  }

  // Calculate CPU values for instances > 8GB
  const prettySize = totalSize / 1024
  const cpuValuePerZone = Math.round(prettySize * cpuMultiplier * 10) / 10

  if (zoneCount) {
    const totalCpuValue = Math.round(cpuValuePerZone * zoneCount * 10) / 10
    return `${totalCpuValue}`
  }

  return cpuValuePerZone
}

export function getSizeOptionText({
  value,
  primaryKey,
  secondaryKey,
  instanceResource,
  storageMultiplier,
  cpuMultiplier,
  isBlobStorage,
}: {
  instanceResource: `memory` | `storage`
  storageMultiplier?: number
  cpuMultiplier?: number
  value: number
  primaryKey: string
  secondaryKey?: string
  isBlobStorage?: boolean
}): string {
  const keyLabels = {
    memory: `RAM`,
    storage: `storage`,
    cpu: `vCPU`,
  }
  const primaryText = `${prettySize(
    getNumber({
      instanceResource,
      storageMultiplier,
      totalSize: value,
      resourceType: primaryKey,
      isBlobStorage,
    }),
  )} ${keyLabels[primaryKey]}`

  const secondaryText =
    secondaryKey && storageMultiplier
      ? ` | ${prettySize(
          getNumber({
            instanceResource,
            storageMultiplier,
            totalSize: value,
            resourceType: secondaryKey,
            isBlobStorage,
          }),
        )} ${keyLabels[secondaryKey]}`
      : ``

  const cpuText = cpuMultiplier
    ? ` | ${getCpu({ cpuMultiplier, totalSize: value })} ${keyLabels.cpu}`
    : ``

  return `${primaryText}${secondaryText}${cpuText}`
}

export function getRenderOptions({
  instanceResource,
  storageMultiplier,
  cpuMultiplier,
  value,
  primaryKey,
  secondaryKey,
  isBlobStorage,
}: {
  instanceResource: any
  storageMultiplier?: number
  cpuMultiplier?: number
  value: number
  primaryKey: string
  secondaryKey?: string
  isBlobStorage?: boolean
}) {
  const keyLabels = {
    memory: `RAM`,
    storage: `storage`,
    cpu: `vCPU`,
  }
  const primaryText = `${prettySize(
    getNumber({
      instanceResource,
      storageMultiplier,
      totalSize: value,
      resourceType: primaryKey,
      isBlobStorage,
    }),
  )} ${keyLabels[primaryKey]}`
  const secondaryText =
    storageMultiplier && secondaryKey
      ? `${prettySize(
          getNumber({
            instanceResource,
            storageMultiplier,
            totalSize: value,
            resourceType: secondaryKey,
            isBlobStorage,
          }),
        )} ${keyLabels[secondaryKey]}`
      : ``
  const cpuText = cpuMultiplier
    ? `${getCpu({
        cpuMultiplier,
        totalSize: value,
      })} ${keyLabels.cpu}`
    : ``

  return {
    primary_key: primaryKey,
    secondary_key: secondaryKey,
    primary_text: primaryText,
    secondary_text: secondaryText,
    cpu_text: cpuText,
  }
}
