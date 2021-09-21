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

import { get, noop, find } from 'lodash'

import React, { Component, Fragment, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiBadge,
  EuiButtonEmpty,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormLabel,
  EuiLink,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSpacer,
  EuiSwitch,
  EuiText,
  htmlIdGenerator,
} from '@elastic/eui'

import { CuiAlert } from '../../../../cui'

import LogicSudoGate from '../../../LogicSudoGate'
import SpinButton from '../../../SpinButton'
import DiscreteSizePicker from '../../../DiscreteSizePicker'

import JvmMemoryPressure from '../JvmMemoryPressure'

import RatioLabel from '../../../Topology/DeploymentTemplates/components/RatioLabel'

import toNumber, { toNumberOrElse } from '../../../../lib/toNumber'
import { replaceIn } from '../../../../lib/immutability-helpers'

import { getDefaultDiskQuota } from '../../../../lib/stackDeployments/clusterInstances'
import { castSize } from '../../../../lib/deployments/conversion'

import { AsyncRequestState, StackDeployment } from '../../../../types'

import {
  ClusterInstanceConfigurationInfo,
  ClusterInstanceInfo,
  DeploymentTemplateInfoV2,
} from '../../../../lib/api/v1/types'

import './instanceCapacityOverrideModal.scss'

export type Props = {
  close: () => void
  deployment: StackDeployment
  instance: ClusterInstanceInfo
  instanceConfiguration: ClusterInstanceConfigurationInfo
  resetSetInstanceCapacityRequest: () => void
  setInstanceCapacity: (args: {
    instanceCapacity: number | null
    applyToAll: boolean
  }) => Promise<any>
  setInstanceCapacityRequest: AsyncRequestState
  canApplyToAll: boolean
  deploymentTemplate: DeploymentTemplateInfoV2
}

type State = {
  size: number
  applyToAllLikeThis: boolean
}

const makeId = htmlIdGenerator()

class InstanceCapacityOverrideModal extends Component<Props, State> {
  state: State = {
    size: getCurrentInstanceCapacity({
      instance: this.props.instance,
      instanceConfigMeta: this.props.instanceConfiguration,
      deploymentTemplate: this.props.deploymentTemplate,
    }),
    applyToAllLikeThis: false,
  }

  render(): JSX.Element {
    const { size, applyToAllLikeThis } = this.state

    const {
      canApplyToAll,
      instance,
      instanceConfiguration,
      setInstanceCapacityRequest,
      deploymentTemplate,
    } = this.props

    const { resource, name: instanceConfigurationName } = instanceConfiguration

    const storage = get(instance, [`disk`, `disk_space_available`], 0)
    const memory = get(instance, [`memory`, `instance_capacity`], 0)

    const isStorage = resource === `storage`

    const originalSize = isStorage ? storage : memory
    const originalSecondarySize = isStorage ? memory : storage
    const secondaryRatio = originalSecondarySize / originalSize
    const secondarySize = size * secondaryRatio

    const projectedStorage = isStorage ? size : secondarySize
    const projectedMemory = isStorage ? secondarySize : size

    const projectedInstanceDisk = replaceIn(
      instance,
      [`disk`, `disk_space_available`],
      projectedStorage,
    )
    const projectedInstance = replaceIn(
      projectedInstanceDisk,
      [`memory`, `instance_capacity`],
      projectedMemory,
    )

    const instanceDiffRatio = size / originalSize
    const sizes = getSizeOptions({
      instance,
      instanceConfigMeta: instanceConfiguration,
      deploymentTemplate,
    })

    return (
      <LogicSudoGate onCancel={this.onClose}>
        <EuiOverlayMask>
          <EuiModal
            className='instanceCapacityOverride-modal'
            onClose={this.onClose}
            style={{ width: `48rem` }}
          >
            <EuiModalHeader>
              <EuiModalHeaderTitle>
                <FormattedMessage
                  id='instance-capacity-override-modal.title'
                  defaultMessage='Instance Size Override'
                />
              </EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
              <EuiText>
                <FormattedMessage
                  id='instance-capacity-override-modal.description'
                  defaultMessage='When an instance has reached its size allocation and temporarily needs a bit more room to be able to administrate, you can override its size.'
                />

                <EuiSpacer size='m' />

                <FormattedMessage
                  id='instance-capacity-override-modal.current-size'
                  defaultMessage='This instance has { memorySize } and { storageSize }.'
                  values={{
                    memorySize: (
                      <strong>
                        <RatioLabel resource='memory' size={memory} />
                      </strong>
                    ),
                    storageSize: (
                      <strong>
                        <RatioLabel resource='storage' size={storage} />
                      </strong>
                    ),
                  }}
                />
              </EuiText>

              <EuiSpacer size='m' />

              {/* This fixes the scrollbar appearing from the dynamic negative margins used in the discreet slider */}
              <div style={{ overflowX: `hidden` }}>
                <EuiFormLabel>
                  <FormattedMessage
                    id='instance-capacity-override-modal.instance-capacity-label'
                    defaultMessage='Instance size'
                  />
                </EuiFormLabel>

                <EuiSpacer size='s' />

                <EuiFlexGroup gutterSize='m' alignItems='center'>
                  <EuiFlexItem grow={false}>
                    <DiscreteSizePicker
                      instanceCapacityOverrideModal={true}
                      data-test-id='instance-capacity-slider'
                      value={String(size)}
                      options={sizes}
                      // We should never fail to parse the string
                      onChange={(value) => this.setState({ size: toNumberOrElse(value, -1) })}
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>

                <EuiSpacer size='m' />

                {canApplyToAll && (
                  <EuiSwitch
                    id={makeId()}
                    label={
                      <FormattedMessage
                        id='instance-capacity-override-modal.apply-to-all-like-this'
                        defaultMessage='Apply to all { instanceConfiguration } instances in this deployment'
                        values={{
                          instanceConfiguration: <EuiBadge>{instanceConfigurationName}</EuiBadge>,
                        }}
                      />
                    }
                    checked={applyToAllLikeThis}
                    onChange={this.toggleApplyToAll}
                  />
                )}

                {applyToAllLikeThis && (
                  <Fragment>
                    <EuiSpacer size='m' />

                    <EuiCallOut color='warning'>
                      <FormattedMessage
                        id='instance-capacity-override-modal.restart-warning'
                        defaultMessage='Note that affected nodes will be restarted automatically, and this might result in temporarily downgraded performance or downtime.'
                      />
                    </EuiCallOut>
                  </Fragment>
                )}

                <EuiSpacer size='m' />

                <JvmMemoryPressure
                  label={
                    <FormattedMessage
                      id='instance-capacity-override-modal.current-pressure-label'
                      defaultMessage='Current memory pressure'
                    />
                  }
                  instance={instance}
                  isInteractive={false}
                />

                <EuiSpacer size='m' />

                <JvmMemoryPressure
                  label={
                    <FormattedMessage
                      id='instance-capacity-override-modal.projected-pressure-label'
                      defaultMessage='Projected memory pressure'
                    />
                  }
                  instance={projectedInstance}
                  ratio={instanceDiffRatio}
                  isInteractive={false}
                />
              </div>

              <EuiSpacer />

              <EuiText>
                <FormattedMessage
                  id='instance-capacity-override-modal.save-explained'
                  defaultMessage='Upon save, this instance will have a size of { nextSize }.'
                  values={{
                    nextSize: (
                      <strong>
                        <RatioLabel resource={resource} size={size} />
                      </strong>
                    ),
                  }}
                />
              </EuiText>
            </EuiModalBody>

            <EuiModalFooter>
              <div>
                <EuiFlexGroup gutterSize='m' justifyContent='flexEnd' alignItems='center'>
                  {hasCapacityOverride({
                    instance,
                    instanceConfigMeta: instanceConfiguration,
                    size,
                  }) && (
                    <EuiFlexItem grow={false}>
                      <EuiLink color='warning' onClick={this.resetDefaultCapacity}>
                        <FormattedMessage
                          id='instance-capacity-override-modal.reset-system-default'
                          defaultMessage='Reset system default'
                        />
                      </EuiLink>
                    </EuiFlexItem>
                  )}

                  <EuiFlexItem grow={false}>
                    <EuiButtonEmpty onClick={this.onClose}>
                      <FormattedMessage
                        id='instance-capacity-override-modal.cancel'
                        defaultMessage='Cancel'
                      />
                    </EuiButtonEmpty>
                  </EuiFlexItem>

                  <EuiFlexItem grow={false}>
                    <div>
                      <SpinButton
                        data-test-id='instance-capacity-save-btn'
                        onClick={this.onSave}
                        spin={setInstanceCapacityRequest.inProgress}
                        requiresSudo={true}
                        fill={true}
                      >
                        <FormattedMessage
                          id='instance-capacity-override-modal.save'
                          defaultMessage='Save'
                        />
                      </SpinButton>
                    </div>
                  </EuiFlexItem>
                </EuiFlexGroup>

                {setInstanceCapacityRequest.error && (
                  <Fragment>
                    <EuiSpacer size='m' />

                    <CuiAlert type='error' data-test-id='set-instance-capacity-error'>
                      {setInstanceCapacityRequest.error}
                    </CuiAlert>
                  </Fragment>
                )}
              </div>
            </EuiModalFooter>
          </EuiModal>
        </EuiOverlayMask>
      </LogicSudoGate>
    )
  }

  toggleApplyToAll = () => {
    const { applyToAllLikeThis } = this.state

    this.setState({ applyToAllLikeThis: !applyToAllLikeThis })
  }

  onSave = () => {
    const { size, applyToAllLikeThis: applyToAll } = this.state
    const { setInstanceCapacity } = this.props

    setInstanceCapacity({
      instanceCapacity: size,
      applyToAll,
    })
      .then(() => this.onClose())
      .catch(noop) // don't close when there were errors
  }

  resetDefaultCapacity = () => {
    const { instance, instanceConfiguration } = this.props

    this.setState({
      size: getSize(),
    })

    function getSize() {
      const size = getDefaultCapacity({ instance, instanceConfigMeta: instanceConfiguration })

      if (size) {
        return size
      }

      const { resource } = instanceConfiguration
      const storage = get(instance, [`disk`, `disk_space_available`], 0)
      const memory = get(instance, [`memory`, `instance_capacity`], 0)
      const resourceCapacity = resource === `storage` ? storage : memory
      return resourceCapacity
    }
  }

  onClose = () => {
    const { resetSetInstanceCapacityRequest, close } = this.props

    resetSetInstanceCapacityRequest()
    close()
  }
}

function getDefaultCapacity({
  instance,
  instanceConfigMeta,
}: {
  instance: ClusterInstanceInfo
  instanceConfigMeta: ClusterInstanceConfigurationInfo
}) {
  const { resource } = instanceConfigMeta
  const memoryPlanned = get(instance, [`memory`, `instance_capacity_planned`])

  const defaultCapacity = castSize({
    from: `memory`,
    to: resource!,
    storageMultiplier: getDefaultDiskQuota({ instance }),
    size: memoryPlanned,
  })

  return defaultCapacity
}

function hasCapacityOverride({
  instance,
  instanceConfigMeta,
  size,
}: {
  instance: ClusterInstanceInfo
  instanceConfigMeta: ClusterInstanceConfigurationInfo
  size: number
}) {
  const { resource } = instanceConfigMeta
  const storage = get(instance, [`disk`, `disk_space_available`], 0)
  const memory = get(instance, [`memory`, `instance_capacity`], 0)
  const resourceCapacity = resource === `storage` ? storage : memory

  if (size !== resourceCapacity) {
    return true
  }

  const defaultCapacity = getDefaultCapacity({
    instance,
    instanceConfigMeta,
  })

  return Boolean(defaultCapacity && defaultCapacity !== size)
}

function getCurrentInstanceCapacity({
  instance,
  instanceConfigMeta,
  deploymentTemplate,
}: {
  instance: ClusterInstanceInfo
  instanceConfigMeta: ClusterInstanceConfigurationInfo
  deploymentTemplate: DeploymentTemplateInfoV2
}) {
  const { resource } = instanceConfigMeta
  const storage = get(instance, [`disk`, `disk_space_available`], 0)
  const memory = get(instance, [`memory`, `instance_capacity`], 0)

  const size = resource === `storage` ? storage : memory

  if (!isFinite(size)) {
    const sizes = getSizeOptions({ instance, instanceConfigMeta, deploymentTemplate })
    const [firstSize] = sizes
    return toNumber(firstSize.value)
  }

  return size
}

function getSizeOptions({
  instance,
  instanceConfigMeta,
  deploymentTemplate,
}: {
  instance: ClusterInstanceInfo
  instanceConfigMeta: ClusterInstanceConfigurationInfo
  deploymentTemplate: DeploymentTemplateInfoV2
}): Array<{ children: ReactNode; text: ReactNode; value: string }> {
  const defaultCapacity = getDefaultCapacity({
    instance,
    instanceConfigMeta,
  })

  const { resource, sizes } = getDiscreteConfiguration()

  const storage: number = get(instance, [`disk`, `disk_space_available`], 0)
  const memory: number = get(instance, [`memory`, `instance_capacity`], 0)

  const resourceCapacity = resource === `storage` ? storage : memory
  const secondaryResource = resource === `memory` ? `storage` : `memory`
  const secondaryResourceCapacity = secondaryResource === `storage` ? storage : memory
  const ratio = secondaryResourceCapacity / resourceCapacity

  if (isFinite(resourceCapacity) && !sizes.includes(resourceCapacity)) {
    sizes.push(resourceCapacity)
  }

  sizes.sort((a, b) => a - b)

  const lastSize = sizes[sizes.length - 1]

  sizes.push(lastSize * 2)
  sizes.push(lastSize * 4)

  return sizes.map((size) => ({
    value: String(size),
    text: (
      <Fragment>
        <RatioLabel resource={resource} size={size} />

        <EuiSpacer size='xs' />

        <RatioLabel resource={secondaryResource} size={size * ratio} />
      </Fragment>
    ),
    children: getFancyLabel(size),
  }))

  function getFancyLabel(size: number): ReactNode {
    if (size === resourceCapacity) {
      return (
        <Fragment>
          <EuiSpacer size='s' />

          <EuiBadge>
            <FormattedMessage
              id='instance-capacity-override-modal.current'
              defaultMessage='Current'
            />
          </EuiBadge>
        </Fragment>
      )
    }

    if (size === defaultCapacity) {
      return (
        <Fragment>
          <EuiSpacer size='s' />

          <EuiBadge color='warning'>
            <FormattedMessage
              id='instance-capacity-override-modal.system-default'
              defaultMessage='Default'
            />
          </EuiBadge>
        </Fragment>
      )
    }

    return null
  }

  function getDiscreteConfiguration() {
    const { id } = instanceConfigMeta
    const instanceConfiguration = find(deploymentTemplate.instance_configurations, { id })

    if (!instanceConfiguration) {
      // sanity
      return { resource: instanceConfigMeta.resource, sizes: [] }
    }

    const {
      discrete_sizes: { resource, sizes },
    } = instanceConfiguration

    return { resource, sizes: [...sizes] }
  }
}

export default InstanceCapacityOverrideModal
