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
  EuiButton,
  EuiCode,
  EuiContextMenuItem,
  EuiButtonEmpty,
  EuiFormHelpText,
  EuiLoadingSpinner,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiText,
  EuiToolTip,
} from '@elastic/eui'

import { isHidden, isEsStopped } from '../../../../../lib/stackDeployments'

import { AsyncRequestState, StackDeployment } from '../../../../../types'
import RequiresSudo from '../../../../RequiresSudo'
import { addToast, parseError } from '../../../../../cui'

type Props = {
  deployment: StackDeployment
  fetchDeployment: () => void
  shutdownStackDeployment: () => void
  resetShutdownStackDeployment: () => void
  shutdownStackDeploymentRequest: AsyncRequestState
}

type State = {
  requestChainProgress: boolean
  isConfirmModalOpen: boolean
}

class HideDeployment extends Component<Props, State> {
  mounted: boolean = false

  state: State = {
    requestChainProgress: false,
    isConfirmModalOpen: false,
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    const { resetShutdownStackDeployment } = this.props
    resetShutdownStackDeployment()
    this.mounted = false
  }

  render() {
    const { shutdownStackDeploymentRequest, deployment } = this.props
    const { requestChainProgress } = this.state
    const stopped = isEsStopped({ deployment })

    if (isHidden({ deployment })) {
      return null
    }

    const isBusy = requestChainProgress || shutdownStackDeploymentRequest.inProgress

    return (
      <RequiresSudo
        helpText={false}
        actionPrefix={false}
        renderSudoGate={({ openSudoModal }) => (
          <EuiContextMenuItem
            onClick={openSudoModal}
            data-test-id='deploymentHide-Btn'
            icon={isBusy ? <EuiLoadingSpinner size='m' /> : 'trash'}
            disabled={!stopped || isBusy}
          >
            <EuiToolTip
              content={
                !stopped && (
                  <EuiFormHelpText>
                    <FormattedMessage
                      id='cluster-hide-cluster.stop-cluster-before-hide'
                      defaultMessage='You need to stop the cluster before you can hide it.'
                    />
                  </EuiFormHelpText>
                )
              }
            >
              <FormattedMessage
                id='cluster-hide-cluster.hide-cluster'
                defaultMessage='Hide cluster'
              />
            </EuiToolTip>
          </EuiContextMenuItem>
        )}
        to={
          <FormattedMessage id='cluster-hide-cluster.hide-cluster' defaultMessage='Hide cluster' />
        }
      >
        <EuiContextMenuItem
          data-test-id='deploymentHide-Btn'
          icon={isBusy ? <EuiLoadingSpinner size='m' /> : 'trash'}
          disabled={!stopped || isBusy}
          onClick={this.openConfirmModal}
        >
          <EuiToolTip
            content={
              !stopped && (
                <EuiFormHelpText>
                  <FormattedMessage
                    id='cluster-hide-cluster.stop-cluster-before-hide'
                    defaultMessage='You need to stop the cluster before you can hide it.'
                  />
                </EuiFormHelpText>
              )
            }
          >
            <FormattedMessage
              id='cluster-hide-cluster.hide-cluster'
              defaultMessage='Hide cluster'
            />
          </EuiToolTip>
        </EuiContextMenuItem>
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
                id='deployment-delete-deployment.title'
                defaultMessage='Delete your deployment?'
              />
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiText>
              <FormattedMessage
                id='cluster-hide-cluster.description'
                defaultMessage="Sets the {hidden} flag to {true} in the cluster's data."
                values={{
                  hidden: <EuiCode>hidden</EuiCode>,
                  true: <EuiCode>true</EuiCode>,
                }}
              />
            </EuiText>
          </EuiModalBody>
          <EuiModalFooter>
            <EuiButton data-test-id='confirmModalConfirmButton' onClick={this.shutdown}>
              <FormattedMessage id='cluster-hide-cluster.confirm' defaultMessage='Hide' />
            </EuiButton>
            <EuiButtonEmpty onClick={this.closeConfirmModal}>
              <FormattedMessage id='cluster-hide-cluster.cancel' defaultMessage='Cancel' />
            </EuiButtonEmpty>
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

  shutdown = () => {
    const { shutdownStackDeployment, fetchDeployment } = this.props

    Promise.resolve()
      .then(() => this.setState({ requestChainProgress: true }))
      .then(() => shutdownStackDeployment())
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
                id='toasts.title-hide-failed'
                defaultMessage='Hide deployment failed'
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

export default HideDeployment
