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

import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { get, noop } from 'lodash'

import {
  EuiBadge,
  EuiButtonEmpty,
  EuiFieldNumber,
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

import DiskUsage from '../DiskUsage'

import RatioLabel from '../../../Topology/DeploymentTemplates/components/RatioLabel'

import {
  getCurrentDiskQuota,
  getDefaultDiskQuota,
} from '../../../../lib/stackDeployments/clusterInstances'

import toNumber from '../../../../lib/toNumber'
import { replaceIn } from '../../../../lib/immutability-helpers'

import { AsyncRequestState, StackDeployment } from '../../../../types'
import { ClusterInstanceConfigurationInfo, ClusterInstanceInfo } from '../../../../lib/api/v1/types'

import './diskQuotaOverrideModal.scss'

const makeId = htmlIdGenerator()

export type Props = {
  close: () => void
  deployment: StackDeployment
  instance: ClusterInstanceInfo
  instanceConfiguration?: ClusterInstanceConfigurationInfo
  resetSetDiskQuotaRequest: () => void
  setDiskQuota: (params: {
    diskQuota: number | null
    defaultDiskQuota: number
    previousDiskQuota: number
    applyToAll: boolean
  }) => Promise<any>
  setDiskQuotaRequest: AsyncRequestState
  canApplyToAll: boolean
}

type State = {
  quota: number
  applyToAllLikeThis: boolean
}

class DiskQuotaOverrideModal extends Component<Props, State> {
  state: State = {
    quota: getCurrentDiskQuota({ instance: this.props.instance }),
    applyToAllLikeThis: false,
  }

  render(): JSX.Element {
    const { quota, applyToAllLikeThis } = this.state

    const { canApplyToAll, instance, instanceConfiguration, setDiskQuotaRequest } = this.props

    const instanceConfigurationName = get(instanceConfiguration, [`name`], ``)
    const storage = get(instance, [`disk`, `disk_space_available`], 0)
    const memory = get(instance, [`memory`, `instance_capacity`], 0)

    const currentDiskQuota = getCurrentDiskQuota({ instance })
    const projectedStorage = (storage / currentDiskQuota) * quota

    const storagePath = [`disk`, `disk_space_available`]
    const projectedInstance = replaceIn(instance, storagePath, projectedStorage)

    const defaultDiskQuota = getDefaultDiskQuota({ instance })

    return (
      <LogicSudoGate onCancel={this.onClose}>
        <EuiOverlayMask>
          <EuiModal
            className='diskQuotaOverride-modal'
            onClose={this.onClose}
            style={{ width: `48rem` }}
          >
            <EuiModalHeader>
              <EuiModalHeaderTitle>
                <FormattedMessage
                  id='disk-quota-override-modal.title'
                  defaultMessage='Disk Quota Override'
                />
              </EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
              <EuiText>
                <FormattedMessage
                  id='disk-quota-override-modal.description'
                  defaultMessage='When a cluster instance has exceeded its disk space and temporarily needs a bit more room to be able to upgrade, you can override the disk quota.'
                />

                <EuiSpacer size='m' />

                <FormattedMessage
                  id='disk-quota-override-modal.current-size'
                  defaultMessage='This instance has { memorySize } and { storageSize }. Currently, the disk quota is { currentDiskQuota }.'
                  values={{
                    currentDiskQuota,
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

              <div className='diskQuotaOverride-form'>
                <EuiFormLabel>
                  <FormattedMessage
                    id='disk-quota-override-modal.disk-quota-label'
                    defaultMessage='Disk quota'
                  />
                </EuiFormLabel>

                <EuiSpacer size='s' />

                <EuiFieldNumber
                  data-test-id='disk-quota-input'
                  style={{ maxWidth: `6rem` }}
                  min={1}
                  max={1000}
                  onChange={(e) => {
                    const asNumber = toNumber(e.target.value)

                    if (asNumber != null) {
                      this.onChange(asNumber)
                    }
                  }}
                  value={quota}
                />

                <EuiSpacer size='m' />

                {canApplyToAll && (
                  <EuiSwitch
                    id={makeId()}
                    label={
                      <FormattedMessage
                        id='disk-quota-override-modal.apply-to-all-like-this'
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

                <EuiSpacer size='m' />

                <DiskUsage
                  label={
                    <FormattedMessage
                      id='disk-quota-override-modal.current-usage'
                      defaultMessage='Current disk usage'
                    />
                  }
                  instance={instance}
                />

                <EuiSpacer size='m' />

                <DiskUsage
                  label={
                    <FormattedMessage
                      id='disk-quota-override-modal.projected-usage'
                      defaultMessage='Projected disk usage'
                    />
                  }
                  instance={projectedInstance}
                />
              </div>

              <EuiSpacer />

              <EuiText>
                <FormattedMessage
                  id='disk-quota-override-modal.save-explained'
                  defaultMessage='Upon save, this instance will have a storage capacity of { storageCapacity }.'
                  values={{
                    storageCapacity: (
                      <strong>
                        <RatioLabel resource='storage' size={projectedStorage} />
                      </strong>
                    ),
                  }}
                />
              </EuiText>
            </EuiModalBody>

            <EuiModalFooter>
              <div>
                <EuiFlexGroup gutterSize='m' justifyContent='flexEnd' alignItems='center'>
                  {quota !== defaultDiskQuota && (
                    <EuiFlexItem grow={false}>
                      <EuiLink
                        color='warning'
                        onClick={() => this.onChange(defaultDiskQuota)}
                        data-test-id='reset-system-default'
                      >
                        <FormattedMessage
                          id='disk-quota-override-modal.reset-system-default'
                          defaultMessage='Reset system default'
                        />
                      </EuiLink>
                    </EuiFlexItem>
                  )}

                  <EuiFlexItem grow={false}>
                    <EuiButtonEmpty onClick={this.onClose}>
                      <FormattedMessage
                        id='disk-quota-override-modal.cancel'
                        defaultMessage='Cancel'
                      />
                    </EuiButtonEmpty>
                  </EuiFlexItem>

                  <EuiFlexItem grow={false}>
                    <div>
                      <SpinButton
                        data-test-id='disk-quota-save-btn'
                        onClick={this.onSave}
                        spin={setDiskQuotaRequest.inProgress}
                        requiresSudo={true}
                        fill={true}
                      >
                        <FormattedMessage
                          id='disk-quota-override-modal.save'
                          defaultMessage='Save'
                        />
                      </SpinButton>
                    </div>
                  </EuiFlexItem>
                </EuiFlexGroup>

                {setDiskQuotaRequest.error && (
                  <Fragment>
                    <EuiSpacer size='m' />

                    <CuiAlert type='error' data-test-id='set-disk-quota-error'>
                      {setDiskQuotaRequest.error}
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

  onChange(nextQuota: number) {
    this.setState({ quota: nextQuota })
  }

  toggleApplyToAll = () => {
    const { applyToAllLikeThis } = this.state

    this.setState({ applyToAllLikeThis: !applyToAllLikeThis })
  }

  onSave = () => {
    const { quota, applyToAllLikeThis: applyToAll } = this.state

    const { instance, setDiskQuota } = this.props

    const currentDiskQuota = getCurrentDiskQuota({ instance })
    const defaultDiskQuota = getDefaultDiskQuota({ instance })

    const diskQuota = quota === defaultDiskQuota ? null : quota

    setDiskQuota({
      diskQuota,
      previousDiskQuota: currentDiskQuota,
      defaultDiskQuota,
      applyToAll,
    })
      .then(() => this.onClose())
      .catch(noop) // don't close when there were errors
  }

  onClose = () => {
    const { resetSetDiskQuotaRequest, close } = this.props

    resetSetDiskQuotaRequest()
    close()
  }
}

export default DiskQuotaOverrideModal
