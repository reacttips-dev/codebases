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

import { size, xor } from 'lodash'
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
} from '@elastic/eui'

import FeedbackModal from './FeedbackModal'

import RequiresSudo from '../../../../RequiresSudo'

import { CuiPermissibleControl, parseError, addToast } from '../../../../../cui'

import { getConfigForKey } from '../../../../../store'

import { hasOngoingConfigurationChange } from '../../../../../lib/stackDeployments'
import { isAzurePlusUser, isIntegratedAzurePlusDeployment } from '../../../../../lib/marketPlace'

import Permission from '../../../../../lib/api/v1/permissions'

import { SearchRecord } from '../../../../../reducers/searchClusters'

import { StackDeployment, AsyncRequestState, ProfileState } from '../../../../../types'
import { FeedbackType } from '../../../../../types/custom'

enum FeedbackOptions {
  NOT_NEEDED = 'not_needed',
  CONSOLIDATING_ACCOUNTS = 'consolidating_accounts',
  TOO_EXPENSIVE = 'too_expensive',
  STABILITY_ISSUES = 'stability_issues',
  BAD_SUPPORT = 'bad_support',
  BAD_DOCUMENTATION = 'bad_documentation',
  OTHER = 'other',
}

export type FeedbackMap = {
  [key in FeedbackOptions]: boolean
}

type Props = {
  fetchClusters: (options: { esQuery?: any; deletedClusters: string[]; size?: number }) => void
  fetchDeployment: () => void
  deletedClusters: string[]
  deployment: StackDeployment
  resetShutdownStackDeployment: () => AsyncRequestState
  shutdownStackDeploymentRequest: AsyncRequestState
  searchResultsRequest: AsyncRequestState
  searchResults?: SearchRecord | null
  profile: NonNullable<ProfileState>
  stopAndHideDeployment: () => void
  submitUserFeedback: (options: {
    deployment: StackDeployment
    type: string
    reasons: FeedbackType[]
    feedback: string
  }) => void
  intl: IntlShape
}

type State = {
  reasons: FeedbackType[]
  feedback: string
  deleteValue: string
  isConfirmModalOpen: boolean
  isFeedbackModalOpen: boolean
  requestChainProgress: boolean
  isInvalid: boolean
}

class HideDeploymentInUserconsole extends Component<Props, State> {
  mounted: boolean = false

  state: State = {
    reasons: [],
    feedback: ``,
    deleteValue: ``,
    isConfirmModalOpen: false,
    isFeedbackModalOpen: false,
    requestChainProgress: false,
    isInvalid: false,
  }

  componentDidMount() {
    const { fetchClusters, deletedClusters } = this.props
    const mightAskForFeedback = this.couldInvolveFeedback()

    if (mightAskForFeedback) {
      fetchClusters({ deletedClusters })
    }

    this.mounted = true
  }

  componentDidUpdate(prevProps: Props) {
    const { deployment, resetShutdownStackDeployment } = this.props
    const wasPending = hasOngoingConfigurationChange({ deployment: prevProps.deployment })
    const isPending = hasOngoingConfigurationChange({ deployment })

    // Whenever we change from not pending to pending we need to make sure the restart button
    // is no longer in the 'successfully saved deployment' state.
    if (!wasPending && isPending) {
      resetShutdownStackDeployment()
    }
  }

  componentWillUnmount() {
    const { resetShutdownStackDeployment } = this.props
    resetShutdownStackDeployment()
    this.mounted = false
  }

  render() {
    const { searchResultsRequest, shutdownStackDeploymentRequest, profile, deployment } = this.props
    const { requestChainProgress } = this.state
    const isBusy =
      requestChainProgress ||
      shutdownStackDeploymentRequest.inProgress ||
      searchResultsRequest.inProgress

    const azurePlusUser = isAzurePlusUser(profile)

    const azurePlusDeployment = isIntegratedAzurePlusDeployment(deployment)
    const deleteOnAzurePlus = azurePlusUser && azurePlusDeployment

    return (
      <RequiresSudo
        helpText={false}
        actionPrefix={false}
        to={
          <FormattedMessage
            id='deployment-shut-down-and-hide-deployment.shut-down-deployment'
            defaultMessage='Delete deployment'
          />
        }
        renderSudoGate={({ openSudoModal }) => (
          <EuiContextMenuItem
            className='actionsDropdown-delete-deployment'
            data-test-id='deploymentDelete-Btn'
            icon={isBusy ? <EuiLoadingSpinner size='m' /> : <EuiIcon type='trash' />}
            disabled={isBusy || deleteOnAzurePlus}
            onClick={openSudoModal}
          >
            <FormattedMessage
              id='deployment-shut-down-and-hide-deployment.shut-down-deployment'
              defaultMessage='Delete deployment'
            />
          </EuiContextMenuItem>
        )}
      >
        <CuiPermissibleControl permissions={Permission.shutdownDeployment} fillSpace={true}>
          <EuiContextMenuItem
            className='actionsDropdown-delete-deployment'
            data-test-id='deploymentDelete-Btn'
            icon={isBusy ? <EuiLoadingSpinner size='m' /> : <EuiIcon type='trash' />}
            disabled={isBusy || deleteOnAzurePlus}
            onClick={this.openConfirmModal}
            toolTipContent={
              deleteOnAzurePlus && (
                <FormattedMessage
                  id='deployment-shut-down-and-hide-deployment.shut-down-deployment-azure'
                  defaultMessage='Go to the Azure console to delete this deployment.'
                />
              )
            }
            toolTipPosition='bottom'
          >
            <FormattedMessage
              id='deployment-shut-down-and-hide-deployment.shut-down-deployment'
              defaultMessage='Delete deployment'
            />
          </EuiContextMenuItem>
        </CuiPermissibleControl>

        {this.renderConfirmModal()}
        {this.renderFeedbackModal()}
      </RequiresSudo>
    )
  }

  renderConfirmModal() {
    const { searchResultsRequest, deployment } = this.props
    const { isConfirmModalOpen } = this.state

    if (!isConfirmModalOpen) {
      return null
    }

    if (searchResultsRequest.inProgress) {
      return null
    }

    return (
      <EuiOverlayMask>
        <EuiModal onClose={this.closeConfirmModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage
                id='deployment-shut-down-and-hide-deployment.title'
                defaultMessage='Delete your deployment?'
              />
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiText>
              <p>
                {deployment.name ? (
                  <FormattedMessage
                    id='deployment-shut-down-and-hide-deployment.body-named'
                    defaultMessage='This action permanently deletes {name} and removes all files from the disk.'
                    values={{
                      name: <strong>{deployment.name}</strong>,
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id='deployment-shut-down-and-hide-deployment.body'
                    defaultMessage='This action permanently deletes your deployment and removes all files from the disk.'
                  />
                )}
              </p>
            </EuiText>
            <EuiSpacer size='m' />
            <FormattedMessage
              id='deployment-shut-down-and-hide-deployment.attention-test'
              defaultMessage='Please type {delete} to delete your deployment.'
              values={{
                // tslint:disable-next-line
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
              <FormattedMessage
                id='deployment-shut-down-and-hide-deployment.cancel'
                defaultMessage='Cancel'
              />
            </EuiButtonEmpty>

            <EuiButton
              disabled={this.shouldDisableConfirmButton()}
              onClick={this.shouldGetFeedback() ? this.openFeedbackModal : this.stop}
              data-test-id='delete-text-confirm'
              fill={true}
              color='danger'
            >
              <FormattedMessage
                id='deployment-shut-down-and-hide-deployment.confirm'
                defaultMessage='Delete'
              />
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  renderFeedbackModal() {
    const { searchResultsRequest } = this.props
    const { isFeedbackModalOpen, reasons } = this.state

    if (!isFeedbackModalOpen) {
      return null
    }

    const shouldAskForFeedback = this.shouldGetFeedback()

    if (!shouldAskForFeedback) {
      return
    }

    if (searchResultsRequest.inProgress) {
      return null
    }

    const { feedback, isInvalid } = this.state

    return (
      <FeedbackModal
        selectedReasons={reasons}
        feedback={feedback}
        onCheckboxChange={(id) => this.onCheckboxChange(id)}
        isInvalid={isInvalid}
        stop={() => this.stop()}
        stopAndHide={() => this.stopAndHide()}
        onChangeFeedback={(e) => this.setState({ feedback: e.target.value })}
        closeFeedbackModal={() => this.closeFeedbackModal()}
      />
    )
  }

  onCheckboxChange(reason) {
    this.setState({
      // add or remove as appropriate
      reasons: xor(this.state.reasons, [reason]),
    })
  }

  closeConfirmModal = () => {
    this.setState({ isConfirmModalOpen: false })
  }

  closeFeedbackModal = () => {
    this.setState({
      isFeedbackModalOpen: false,
      isInvalid: false,
      reasons: [],
    })
  }

  openConfirmModal = () => {
    this.setState({ isConfirmModalOpen: true })
  }

  openFeedbackModal = () => {
    this.closeConfirmModal()
    this.setState({ isFeedbackModalOpen: true })
  }

  shouldGetFeedback(): boolean {
    const { searchResults } = this.props
    const mightAskForFeedback = this.couldInvolveFeedback()

    if (!mightAskForFeedback) {
      return false
    }

    if (!searchResults) {
      return false
    }

    return size(searchResults.record) === 1
  }

  shouldDisableConfirmButton() {
    const { deleteValue } = this.state

    if (deleteValue !== `DELETE`) {
      return true
    }
  }

  // only affects non-trial SaaS userconsole users terminating their last deployment
  couldInvolveFeedback() {
    const isSaas = getConfigForKey(`APP_FAMILY`) === `saas`
    const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`

    if (!isSaas) {
      // filters out ESSP UC, and — eventually — ECE UC as well.
      return false
    }

    if (!isUserConsole) {
      return false
    }

    const { profile } = this.props
    const { email, inTrial } = profile

    if (email.endsWith(`@elastic.co`)) {
      return false
    }

    return !inTrial
  }

  stop = () => {
    const { deployment, submitUserFeedback } = this.props
    const { feedback, reasons } = this.state

    // If `other` has been checked but no feedback given, show error
    if (this.isFeedbackInvalid()) {
      this.setState({ isInvalid: true })
      return
    }

    this.stopAndHide()

    if (reasons.length !== 0) {
      submitUserFeedback({
        type: `deployment_shutdown`,
        deployment,
        reasons,
        feedback,
      })
    }
  }

  isFeedbackInvalid() {
    const { feedback, reasons } = this.state

    if (reasons.find((reason) => reason === `other`) && feedback.trim().length === 0) {
      return true
    }

    return false
  }

  stopAndHide = () => {
    const { stopAndHideDeployment, fetchDeployment } = this.props

    Promise.resolve()
      .then(() => this.setState({ requestChainProgress: true }))
      .then(() => stopAndHideDeployment())
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
}

export default injectIntl(HideDeploymentInUserconsole)
