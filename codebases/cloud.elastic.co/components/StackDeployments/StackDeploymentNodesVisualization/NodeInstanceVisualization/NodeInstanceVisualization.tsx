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

import React, { FunctionComponent, Fragment, ReactChild } from 'react'
import { get } from 'lodash'
import sluggish from 'sluggish'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import { CuiSliderLogo } from '../../../../cui/SliderLogo'

import NodeTileMenu from '../NodeTileMenu'
import NodeAttributeList, { NodeAttribute } from '../NodeAttributeList'
import NodeInstanceDiskAllocation from '../NodeInstanceDiskAllocation'
import FrozenNodeUsage from '../FrozenNodeUsage'
import NodeInstanceJVMMemoryPressure from '../NodeInstanceJVMMemoryPressure'
import NodeInstanceNativeMemoryPressure from '../NodeInstanceNativeMemoryPressure'
import RatioLabel from '../../../Topology/DeploymentTemplates/components/RatioLabel'
import NodeInstanceStatus from '../NodeInstanceStatus'
import AllocatorLink from '../../../Allocator/AllocatorLink'

import { getVersion, getEsTypeDisplayNames } from '../../../../lib/stackDeployments/selectors'
import { createInstanceDisplayName } from '../../../../reducers/clusters/createCluster'
import {
  isUnhealthy,
  isNodePausedByUser,
  hasStoppedRoutingRequests,
} from '../../../../lib/stackDeployments'

import { ClusterInstanceInfo, ElasticsearchResourceInfo } from '../../../../lib/api/v1/types'
import { InstanceSummary, StackDeployment } from '../../../../types'

import './nodeVisualizationInstance.scss'

export interface StateProps {
  isAdminConsole: boolean
}

interface Props extends StateProps {
  deployment: StackDeployment
  instanceSummary: InstanceSummary
  showNativeMemoryPressure?: boolean
}

const NodeInstanceVisualization: FunctionComponent<Props> = ({
  deployment,
  isAdminConsole,
  instanceSummary,
  showNativeMemoryPressure,
}) => {
  const { instance, kind, resource } = instanceSummary
  const { region } = resource
  const { allocator_id } = instance
  const isESNode = kind === 'elasticsearch'

  // TODO: Make generic in lib/sliders for other node types
  const isMlNodeType = instance.service_roles ? instance.service_roles.includes(`ml`) : false
  const sliderNodeType = isMlNodeType ? 'ml' : undefined

  const isFrozen = instance.node_roles?.includes(`data_frozen`)

  const version = getVersion({ deployment })

  return (
    <EuiPanel
      paddingSize='m'
      className={`nodes-visualization-instance ${kind}-tile ${getStatusClassName(instance)}`}
      data-test-id={`${kind}-tile`}
    >
      <EuiFlexGroup alignItems='center' gutterSize='xl' responsive={false}>
        <EuiFlexItem>
          <EuiFlexGroup
            alignItems='center'
            className='nodes-visualization-instance-title'
            justifyContent='center'
            gutterSize='s'
            responsive={false}
          >
            <EuiFlexItem grow={false}>
              <CuiSliderLogo
                sliderInstanceType={kind}
                sliderNodeType={sliderNodeType}
                version={version}
                size='m'
              />
            </EuiFlexItem>

            <EuiFlexItem>
              <EuiTitle size='xs'>
                <h3 data-test-id='node-tile-title'>
                  {createInstanceDisplayName(instance.instance_name)}
                </h3>
              </EuiTitle>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <NodeTileMenu
            deployment={deployment}
            instance={instance}
            instanceConfiguration={instance.instance_configuration}
            resource={resource as ElasticsearchResourceInfo}
            kind={kind}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size='s' />

      <NodeAttributeList attributes={getInstanceAttributes({ deployment, instanceSummary })} />

      {isAdminConsole && allocator_id && (
        <Fragment>
          <AllocatorLink
            allocatorId={allocator_id}
            deploymentId={deployment.id}
            regionId={region}
          />
          <EuiSpacer size='s' />
        </Fragment>
      )}

      {isESNode && (
        <Fragment>
          <EuiHorizontalRule margin='s' />

          {!isFrozen && <NodeInstanceDiskAllocation instance={instance} />}

          {isFrozen && <FrozenNodeUsage instance={instance} deployment={deployment} />}

          {(!isMlNodeType || (isMlNodeType && showNativeMemoryPressure)) && (
            <Fragment>
              <EuiSpacer size='m' />
              <NodeInstanceJVMMemoryPressure instance={instance} />
            </Fragment>
          )}
        </Fragment>
      )}

      {showNativeMemoryPressure && (
        <Fragment>
          <EuiSpacer size='l' />
          <NodeInstanceNativeMemoryPressure instance={instance} />
        </Fragment>
      )}
    </EuiPanel>
  )
}

const getStatusClassName = (instance: ClusterInstanceInfo) => {
  if (isUnhealthy(instance)) {
    return 'nodes-visualization-instance-danger'
  }

  if (isNodePausedByUser(instance)) {
    return 'nodes-visualization-instance-paused'
  }

  if (hasStoppedRoutingRequests(instance)) {
    return 'nodes-visualization-instance-warning'
  }

  return 'nodes-visualization-instance-default'
}

const getInstanceAttributes = ({
  deployment,
  instanceSummary,
}: {
  deployment: StackDeployment
  instanceSummary: InstanceSummary
}): NodeAttribute[] => {
  const { instance } = instanceSummary

  const attributes: NodeAttribute[] = [
    {
      ['data-test-id']: `node-attr-status`,
      content: <NodeInstanceStatus deployment={deployment} instanceSummary={instanceSummary} />,
    },
  ]

  if (instance.service_version) {
    attributes.push({
      ['data-test-id']: `node-attr-version`,
      content: `v${instance.service_version}`,
    })
  }

  const primarySize = getPrimarySize(instance)

  if (primarySize) {
    attributes.push({
      ['data-test-id']: `node-attr-size`,
      content: (
        <EuiText size='xs' color='default'>
          {primarySize}
        </EuiText>
      ),
    })
  }

  const instanceNameAndTypes = getInstanceNameAndTypes(instanceSummary)

  attributes.push({
    ['data-test-id']: `node-attr-name-and-types`,
    content: instanceNameAndTypes,
  })

  return attributes
}

const getInstanceNameAndTypes = (instanceSummary: InstanceSummary): ReactChild => {
  const { instance } = instanceSummary
  const name = get(instance, [`instance_configuration`, `name`], ``)
  const esTypes = getEsTypeDisplayNames(instanceSummary)

  const attributes: NodeAttribute[] = [
    {
      ['data-test-id']: `node-attr-name`,
      content: (
        <EuiText size='xs' color='default' className='nodes-visualization-instance-name'>
          {name}
        </EuiText>
      ),
    },

    ...esTypes.map((type) => ({
      ['data-test-id']: `node-attr-es-type--${sluggish(type)}`,
      content:
        type === 'master' ? (
          <EuiText color='default' size='xs'>
            <strong>{type}</strong>
          </EuiText>
        ) : (
          type
        ),
    })),
  ]

  return <NodeAttributeList attributes={attributes} />
}

const getPrimarySize = (instance: ClusterInstanceInfo) => {
  const { disk, memory, instance_configuration } = instance
  const instanceStorage = get(disk, [`disk_space_available`], 0)
  const instanceMemory = get(memory, [`instance_capacity`], 0)

  if (instanceStorage && get(instance_configuration, [`resource`]) === `storage`) {
    return <RatioLabel resource='storage' size={instanceStorage} />
  }

  if (instanceMemory) {
    return <RatioLabel resource='memory' size={instanceMemory} />
  }

  return null
}

export default NodeInstanceVisualization
