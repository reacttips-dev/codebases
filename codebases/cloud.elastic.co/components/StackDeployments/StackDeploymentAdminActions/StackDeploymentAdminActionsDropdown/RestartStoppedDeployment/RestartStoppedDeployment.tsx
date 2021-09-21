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

import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiButton,
  EuiContextMenuItem,
  EuiLoadingSpinner,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from '@elastic/eui'

import { CuiPermissibleControl, addToast, parseError } from '../../../../../cui'

import prettySize from '../../../../../lib/prettySize'

import {
  getDeploymentSize,
  getDeploymentInstanceCount,
} from '../../../../../lib/deployments/conversion'
import { getInstanceConfigsFromPlan } from '../../../../../lib/instanceConfigurations/instanceConfiguration'

import { getLastSizedPlanAttempt } from '../../../../../lib/stackDeployments'

import Permission from '../../../../../lib/api/v1/permissions'

import { ProfileState, AsyncRequestState, StackDeployment } from '../../../../../types'
import {
  ElasticsearchClusterPlanInfo,
  InstanceConfiguration,
} from '../../../../../lib/api/v1/types'
import RequiresSudo from '../../../../RequiresSudo'

type StateProps = {
  instanceConfigurations: InstanceConfiguration[]
  restoreStackDeploymentRequest: AsyncRequestState
  profile: ProfileState
}

type DispatchProps = {
  fetchDeployment: () => void
  restoreStackDeployment: () => void
  resetRestoreStackDeployment: () => void
  fetchInstanceConfigurationIfNeeded: (instanceConfigId: string) => void
}

type ConsumerProps = {
  deployment: StackDeployment
}

type Props = StateProps & DispatchProps & ConsumerProps

type State = {
  requestChainProgress: boolean
  isConfirmModalOpen: boolean
}

class RestartStoppedDeployment extends Component<Props, State> {
  mounted: boolean = false

  state: State = {
    requestChainProgress: false,
    isConfirmModalOpen: false,
  }

  componentDidMount() {
    const { fetchInstanceConfigurationIfNeeded } = this.props
    const planInfo = this.getRestorePlan()

    if (!planInfo) {
      return
    }

    // load instance configurations of last running plan
    const instanceConfigIds = planInfo.plan ? getInstanceConfigsFromPlan(planInfo.plan) : []

    instanceConfigIds.forEach((instanceConfigId) => {
      fetchInstanceConfigurationIfNeeded(instanceConfigId)
    })

    this.mounted = true
  }

  componentWillUnmount() {
    const { resetRestoreStackDeployment } = this.props
    resetRestoreStackDeployment()
    this.mounted = false
  }

  render() {
    const { restoreStackDeploymentRequest, profile } = this.props
    const { requestChainProgress } = this.state
    const trialExpired = profile ? profile.inTrial && profile.hasExpiredTrial : false
    const isBusy = requestChainProgress || restoreStackDeploymentRequest.inProgress

    return (
      <RequiresSudo
        helpText={false}
        actionPrefix={false}
        to={
          <FormattedMessage
            id='deployment-restart-stopped-deployment.restart-deployment'
            defaultMessage='Restore deployment'
          />
        }
        renderSudoGate={({ openSudoModal }) => (
          <EuiContextMenuItem
            icon={isBusy ? <EuiLoadingSpinner size='m' /> : 'refresh'}
            data-test-id='deploymentRestart-Btn'
            disabled={trialExpired || isBusy}
            onClick={openSudoModal}
          >
            <FormattedMessage
              id='deployment-restart-stopped-deployment.restart-deployment'
              defaultMessage='Restore deployment'
            />
          </EuiContextMenuItem>
        )}
      >
        <CuiPermissibleControl
          permissions={Permission.restartDeploymentEsResource}
          fillSpace={true}
        >
          <EuiContextMenuItem
            icon={isBusy ? <EuiLoadingSpinner size='m' /> : 'refresh'}
            data-test-id='deploymentRestart-Btn'
            disabled={trialExpired || isBusy}
            onClick={this.openConfirmModal}
          >
            <FormattedMessage
              id='deployment-restart-stopped-deployment.restart-deployment'
              defaultMessage='Restore deployment'
            />
          </EuiContextMenuItem>
        </CuiPermissibleControl>

        {this.renderConfirmModal()}
      </RequiresSudo>
    )
  }

  renderConfirmModal() {
    const { isConfirmModalOpen } = this.state

    if (!isConfirmModalOpen) {
      return null
    }

    return (
      <EuiOverlayMask>
        <EuiModal onClose={this.closeConfirmModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage
                id='deployment-restart-stopped-deployment.title'
                defaultMessage='Restore your deployment?'
              />
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>{this.getAppraisal()}</EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={this.closeConfirmModal}>
              <FormattedMessage
                id='deployment-shut-down-and-hide-deployment.cancel'
                defaultMessage='Cancel'
              />
            </EuiButtonEmpty>

            <EuiButton data-test-id='confirmModalConfirmButton' onClick={this.restart}>
              <FormattedMessage
                id='deployment-restart-stopped-deployment.restart-deployment-confirm'
                defaultMessage='Restore'
              />
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  closeConfirmModal = () => {
    this.setState({ isConfirmModalOpen: false })
  }

  openConfirmModal = () => {
    this.setState({ isConfirmModalOpen: true })
  }

  getAppraisal() {
    const { instanceConfigurations } = this.props
    const restorePlan = this.getRestorePlan()

    if (!restorePlan) {
      return null
    }

    const { plan } = restorePlan

    if (!plan) {
      return null
    }

    const nodeConfigurations = plan.cluster_topology

    const instanceSize = getDeploymentSize({
      nodeConfigurations,
      instanceConfigurations,
    })

    const instanceCount = getDeploymentInstanceCount({
      plan,
      instanceConfigurations,
    })

    const failedToAppraiseDeploymentSize = instanceCount === 0 || instanceSize === 0

    if (failedToAppraiseDeploymentSize) {
      return null
    }

    return (
      <FormattedMessage
        id='deployment-restart-stopped-deployment.body'
        defaultMessage='This will restore your deployment of {formattedCount} {instanceCount, plural,
             one {node with}
             other {nodes with a total of}
           } {capacity} memory.'
        values={{
          instanceCount,
          formattedCount: <strong>{instanceCount}</strong>,
          capacity: <strong>{prettySize(instanceSize)}</strong>,
        }}
      />
    )
  }

  getRestorePlan(): ElasticsearchClusterPlanInfo | null {
    const { deployment } = this.props
    const planInfo = getLastSizedPlanAttempt<ElasticsearchClusterPlanInfo>({
      deployment,
      sliderInstanceType: `elasticsearch`,
    })

    return planInfo
  }

  restart = () => {
    const { restoreStackDeployment, fetchDeployment } = this.props

    Promise.resolve()
      .then(() => this.setState({ requestChainProgress: true }))
      .then(() => restoreStackDeployment())
      .then(() => fetchDeployment())
      .then(() => {
        if (this.mounted) {
          return this.setState({ requestChainProgress: false })
        }

        return null
      })
      .catch((error) => {
        if (this.mounted) {
          addToast({
            family: `toast-error`,
            color: `danger`,
            iconType: `broom`,
            title: (
              <FormattedMessage
                id='toasts.title-restarting-failed'
                defaultMessage='Restarting failed'
              />
            ),
            text: parseError(error),
          })

          return this.setState({ requestChainProgress: false })
        }

        return null
      })
  }
}

export default RestartStoppedDeployment
