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
import { FormattedMessage, defineMessages, injectIntl, IntlShape } from 'react-intl'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiCheckbox,
  EuiContextMenuItem,
  EuiFormHelpText,
  EuiIcon,
  EuiLoadingSpinner,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSpacer,
  EuiText,
  EuiToolTip,
} from '@elastic/eui'

import { CuiPermissibleControl, addToast, parseError } from '../../../../../cui'

import { isSystemOwned, hasOngoingConfigurationChange } from '../../../../../lib/stackDeployments'
import RequiresSudo from '../../../../RequiresSudo'

import Permission from '../../../../../lib/api/v1/permissions'

import { AsyncRequestState, StackDeployment } from '../../../../../types'

type Props = {
  intl: IntlShape
  deployment: StackDeployment
  fetchDeployment: (params: { deploymentId: string }) => void
  resetShutdownStackDeployment: (deploymentId: string) => void
  shutdownStackDeployment: (params: {
    deploymentId: string
    hide?: boolean
    skipSnapshot?: boolean
  }) => void
  shutdownStackDeploymentRequest: AsyncRequestState
}

type State = {
  requestChainProgress: boolean
  isConfirmModalOpen: boolean
  skipSnapshot: boolean
}

const messages = defineMessages({
  skipSnapshot: {
    id: `deployment-shut-down-deployment.skip-snapshot`,
    defaultMessage:
      'Skip snapshot — Performs potentially destructive changes to the deployment without taking a snapshot first.',
  },
  skipSnapshotDescription: {
    id: `deployment-shut-down-deployment.skip-snapshot-description`,
    defaultMessage:
      'If the deployment is stuck, overloaded, or otherwise unhealthy, select this option to terminate it anyways.',
  },
})

class StopDeployment extends Component<Props, State> {
  mounted: boolean = false

  state: State = {
    requestChainProgress: false,
    isConfirmModalOpen: false,
    skipSnapshot: false,
  }

  componentDidMount() {
    this.mounted = true
  }

  componentDidUpdate(prevProps: Props) {
    const { deployment, resetShutdownStackDeployment } = this.props
    const wasPending = hasOngoingConfigurationChange({ deployment: prevProps.deployment })
    const isPending = hasOngoingConfigurationChange({ deployment })

    // Whenever we change from not pending to pending we need to make sure the restart button
    // is no longer in the 'successfully saved deployment' state.
    if (!wasPending && isPending) {
      resetShutdownStackDeployment(deployment.id)
    }
  }

  componentWillUnmount() {
    const { deployment, resetShutdownStackDeployment } = this.props
    resetShutdownStackDeployment(deployment.id)
    this.mounted = false
  }

  render() {
    const { deployment, shutdownStackDeploymentRequest } = this.props
    const { requestChainProgress } = this.state
    const { inProgress } = shutdownStackDeploymentRequest
    const systemOwned = isSystemOwned({ deployment })

    const isBusy = requestChainProgress || inProgress

    return (
      <RequiresSudo
        helpText={false}
        actionPrefix={false}
        to={
          <FormattedMessage
            id='deployment-shut-down-deployment.shut-down-deployment'
            defaultMessage='Terminate deployment'
          />
        }
        renderSudoGate={({ openSudoModal }) => (
          <EuiContextMenuItem
            className='actionsDropdown-delete-deployment'
            onClick={openSudoModal}
            icon={isBusy ? <EuiLoadingSpinner size='m' /> : <EuiIcon type='trash' />}
            disabled={systemOwned || isBusy}
            data-test-id='deploymentStop-Btn'
          >
            <EuiToolTip
              content={
                systemOwned && (
                  <FormattedMessage
                    id='deployment-shut-down-deployment.cannot-shut-down-system-deployment'
                    defaultMessage='You cannot terminate a system deployment.'
                  />
                )
              }
            >
              <EuiText color={systemOwned ? undefined : 'danger'}>
                <FormattedMessage
                  id='deployment-shut-down-deployment.shut-down-deployment'
                  defaultMessage='Terminate deployment'
                />
              </EuiText>
            </EuiToolTip>
          </EuiContextMenuItem>
        )}
      >
        <CuiPermissibleControl permissions={Permission.shutdownDeployment} fillSpace={true}>
          <EuiContextMenuItem
            className='actionsDropdown-delete-deployment'
            onClick={this.openConfirmModal}
            icon={isBusy ? <EuiLoadingSpinner size='m' /> : <EuiIcon type='trash' />}
            disabled={systemOwned || isBusy}
            data-test-id='deploymentStop-Btn'
          >
            <EuiToolTip
              content={
                systemOwned && (
                  <FormattedMessage
                    id='deployment-shut-down-deployment.cannot-shut-down-system-deployment'
                    defaultMessage='You cannot terminate a system deployment.'
                  />
                )
              }
            >
              <EuiText>
                <FormattedMessage
                  id='deployment-shut-down-deployment.shut-down-deployment'
                  defaultMessage='Terminate deployment'
                />
              </EuiText>
            </EuiToolTip>
          </EuiContextMenuItem>
        </CuiPermissibleControl>

        {this.renderConfirmModal()}
      </RequiresSudo>
    )
  }

  renderConfirmModal() {
    const {
      intl: { formatMessage },
    } = this.props
    const { skipSnapshot, isConfirmModalOpen } = this.state

    if (!isConfirmModalOpen) {
      return null
    }

    return (
      <EuiOverlayMask>
        <EuiModal onClose={this.closeConfirmModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage
                id='deployment-shut-down-deployment.title'
                defaultMessage='Delete all data and terminate your deployment?'
              />
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            <FormattedMessage
              id='deployment-shut-down-deployment.body'
              defaultMessage='Terminating a deployment will stop all running instances, and {delete}. Only configuration will be saved so you can later restore the deployment.'
              values={{
                delete: (
                  <strong>
                    <FormattedMessage
                      id='deployment-shut-down-deployment.body-delete'
                      defaultMessage='delete all data'
                    />
                  </strong>
                ),
              }}
            />

            <EuiSpacer size='m' />

            <EuiCheckbox
              id='stop-deployment-skipping-snapshot-checkbox'
              label={
                <Fragment>
                  <span>{formatMessage(messages.skipSnapshot)}</span>

                  <EuiFormHelpText>
                    {formatMessage(messages.skipSnapshotDescription)}
                  </EuiFormHelpText>
                </Fragment>
              }
              checked={skipSnapshot}
              onChange={() => this.setState({ skipSnapshot: !skipSnapshot })}
            />
          </EuiModalBody>

          <EuiModalFooter>
            <EuiButtonEmpty onClick={this.closeConfirmModal}>
              <FormattedMessage id='deployment-delete-deployment.cancel' defaultMessage='Cancel' />
            </EuiButtonEmpty>

            <EuiButton data-test-id='confirmModalConfirmButton' onClick={() => this.terminate()}>
              <FormattedMessage
                id='deployment-shut-down-deployment.confirm'
                defaultMessage='Terminate'
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

  terminate = () => {
    const { shutdownStackDeployment, fetchDeployment, deployment } = this.props
    const { skipSnapshot } = this.state
    const deploymentId = deployment.id

    Promise.resolve()
      .then(() => this.setState({ requestChainProgress: true }))
      .then(() => shutdownStackDeployment({ deploymentId, skipSnapshot }))
      .then(() => fetchDeployment({ deploymentId }))
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
                id='toasts.title-stop-failed'
                defaultMessage='Stopping deployment failed'
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

export default injectIntl(StopDeployment)
