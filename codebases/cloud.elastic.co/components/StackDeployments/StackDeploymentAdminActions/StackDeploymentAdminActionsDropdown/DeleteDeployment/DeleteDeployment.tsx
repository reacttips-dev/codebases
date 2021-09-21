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
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiContextMenuItem,
  EuiFieldText,
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

import { isEsStopped, isSystemOwned } from '../../../../../lib/stackDeployments'
import Permission from '../../../../../lib/api/v1/permissions'

import RequiresSudo from '../../../../RequiresSudo'

import { AsyncRequestState, StackDeployment } from '../../../../../types'

type Props = {
  deployment: StackDeployment
  fetchDeployment: () => void
  deleteDeployment: () => void
  deleteStackDeploymentRequest: AsyncRequestState
  intl: IntlShape
}

type State = {
  deleteValue: string
  isConfirmModalOpen: boolean
  requestChainProgress: boolean
}

class DeleteDeployment extends Component<Props, State> {
  mounted: boolean = false

  state: State = {
    deleteValue: ``,
    isConfirmModalOpen: false,
    requestChainProgress: false,
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { deleteStackDeploymentRequest, deployment } = this.props
    const { requestChainProgress } = this.state

    const stopped = isEsStopped({ deployment })
    const systemOwned = isSystemOwned({ deployment })
    const helpText = this.getHelpText({ systemOwned, stopped })
    const isBusy = requestChainProgress || deleteStackDeploymentRequest.inProgress

    return (
      <RequiresSudo
        helpText={false}
        actionPrefix={false}
        renderSudoGate={({ openSudoModal }) => (
          <EuiContextMenuItem
            className='actionsDropdown-delete-deployment'
            onClick={openSudoModal}
            data-test-id='deploymentDelete-Btn'
            disabled={systemOwned || !stopped || isBusy}
            icon={isBusy ? <EuiLoadingSpinner size='m' /> : <EuiIcon type='trash' />}
          >
            <EuiToolTip content={helpText}>
              <FormattedMessage
                id='deployment-delete.shut-down-deployment'
                defaultMessage='Delete deployment'
              />
            </EuiToolTip>
          </EuiContextMenuItem>
        )}
        to={
          <FormattedMessage
            id='deployment-delete.shut-down-deployment'
            defaultMessage='Delete deployment'
          />
        }
      >
        <CuiPermissibleControl permissions={Permission.deleteDeployment} fillSpace={true}>
          <EuiContextMenuItem
            className='actionsDropdown-delete-deployment'
            data-test-id='deploymentDelete-Btn'
            disabled={systemOwned || !stopped || isBusy}
            icon={isBusy ? <EuiLoadingSpinner size='m' /> : <EuiIcon type='trash' />}
            onClick={this.openConfirmModal}
          >
            <EuiToolTip content={helpText}>
              <FormattedMessage
                id='deployment-delete.shut-down-deployment'
                defaultMessage='Delete deployment'
              />
            </EuiToolTip>
          </EuiContextMenuItem>
        </CuiPermissibleControl>

        {this.renderConfirmModal()}
      </RequiresSudo>
    )
  }

  renderConfirmModal() {
    const { deployment } = this.props
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
              <p>
                {deployment.name ? (
                  <FormattedMessage
                    id='deployment-delete-deployment.body-named'
                    defaultMessage='This action permanently deletes {name} and removes all files from the disk.'
                    values={{
                      name: <strong>{deployment.name}</strong>,
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id='deployment-delete-deployment.body'
                    defaultMessage='This action permanently deletes your deployment and removes all files from the disk.'
                  />
                )}
              </p>
            </EuiText>
            <EuiSpacer size='m' />
            <FormattedMessage
              id='deployment-delete-deployment.attention-test'
              defaultMessage='Please type {delete} to delete your deployment.'
              values={{
                delete: <code>DELETE</code>,
              }}
            />
            <EuiSpacer size='s' />
            <EuiFieldText
              data-test-id='delete-text'
              value={this.state.deleteValue}
              onChange={(e) => this.setState({ deleteValue: e.target.value })}
            />
          </EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={this.closeConfirmModal} data-test-id='delete-text-cancel'>
              <FormattedMessage id='deployment-delete-deployment.cancel' defaultMessage='Cancel' />
            </EuiButtonEmpty>

            <EuiButton
              disabled={this.shouldDisableConfirmButton()}
              onClick={this.deleteDeployment}
              data-test-id='delete-text-confirm'
              fill={true}
              color='danger'
            >
              <FormattedMessage id='deployment-delete-deployment.confirm' defaultMessage='Delete' />
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  deleteDeployment = () => {
    const { deleteDeployment, fetchDeployment } = this.props

    Promise.resolve()
      .then(() => this.setState({ requestChainProgress: true }))
      .then(() => deleteDeployment())
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
                id='toasts.title-deleting-failed'
                defaultMessage='Deleting your deployment failed'
              />
            ),
            text: parseError(error),
          })

          return this.setState({ requestChainProgress: false })
        }

        return null
      })
  }

  getHelpText({ systemOwned, stopped }) {
    if (systemOwned) {
      return (
        <FormattedMessage
          id='deployment-delete-deployment.cannot-delete-system-deployment'
          defaultMessage='You cannot delete a system deployment.'
        />
      )
    }

    if (!stopped) {
      return (
        <FormattedMessage
          id='deployment-delete-deployment.terminate-deployment-before-delete'
          defaultMessage='You need to terminate the deployment before you can delete it.'
        />
      )
    }

    return null
  }

  closeConfirmModal = () => this.setState({ isConfirmModalOpen: false })

  openConfirmModal = () => this.setState({ isConfirmModalOpen: true })

  shouldDisableConfirmButton() {
    const { deleteValue } = this.state

    if (deleteValue !== `DELETE`) {
      return true
    }
  }
}

export default injectIntl(DeleteDeployment)
