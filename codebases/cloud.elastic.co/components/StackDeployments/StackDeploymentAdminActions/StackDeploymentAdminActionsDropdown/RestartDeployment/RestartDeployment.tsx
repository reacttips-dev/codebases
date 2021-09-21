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
import { defineMessages, FormattedMessage } from 'react-intl'
import { get } from 'lodash'

import {
  EuiBadge,
  EuiButton,
  EuiButtonEmpty,
  EuiContextMenuItem,
  EuiRadioGroup,
  EuiLoadingSpinner,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiText,
  EuiTitle,
  htmlIdGenerator,
} from '@elastic/eui'

import { CuiPermissibleControl, addToast, parseError } from '../../../../../cui'

import Permission from '../../../../../lib/api/v1/permissions'

import { AsyncRequestState, StackDeployment, RestartStrategy } from '../../../../../types'
import RequiresSudo from '../../../../RequiresSudo'

type StateProps = {
  restartStackDeploymentEsResourceRequest: AsyncRequestState
}

type DispatchProps = {
  restartStackDeploymentEsResource: (strategy: RestartStrategy) => void
  resetRestartStackDeploymentEsResource: () => void
  fetchDeployment: () => void
}

type ConsumerProps = {
  deployment: StackDeployment
}

type Props = StateProps & DispatchProps & ConsumerProps

type State = {
  idPrefix: string
  selectedStrategy: RestartStrategy
  requestChainProgress: boolean
  isConfirmModalOpen: boolean
}

const makeId = htmlIdGenerator()

const messages = defineMessages({
  fullRestart: {
    id: `deployment.force-restart.strategy.fullRestart`,
    defaultMessage: `Full restart. All instances restart simultaneously.`,
  },
  zoneByZone: {
    id: `deployment.force-restart.strategy.zoneByZone`,
    defaultMessage: `Restart all instances within an availability zone, before moving on to the next zone.`,
  },
  rolling: {
    id: `deployment.force-restart.strategy.rolling`,
    defaultMessage: `Restart instances one at a time. {recommended}`,
  },
  recommended: {
    id: `deployment.force-restart.strategy.recommended`,
    defaultMessage: `Recommended`,
  },
  preamble: {
    id: `deployment.force-restart.preamble`,
    defaultMessage: `How do you want to apply the restart?`,
  },
  confirm: {
    id: `deployment.force-restart.confirm`,
    defaultMessage: `Restart`,
  },
  title: {
    id: `deployment.force-restart.title`,
    defaultMessage: `Restart your deployment?`,
  },
  buttonText: {
    id: `deployment.force-restart.buttonText`,
    defaultMessage: `Restart`,
  },
  noDowntime: {
    id: `deployment.force-restart.no-downtime`,
    defaultMessage: `No downtime`,
  },
  withDowntime: {
    id: `deployment.force-restart.with-downtime`,
    defaultMessage: `With downtime`,
  },
})

class RestartDeployment extends Component<Props, State> {
  mounted: boolean = false

  state: State = {
    idPrefix: makeId(),
    selectedStrategy: `__name__`,
    requestChainProgress: false,
    isConfirmModalOpen: false,
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.props.resetRestartStackDeploymentEsResource()
    this.mounted = false
  }

  render() {
    const {
      restartStackDeploymentEsResourceRequest: { inProgress },
    } = this.props

    const { requestChainProgress } = this.state

    const isBusy = requestChainProgress || inProgress
    return (
      <RequiresSudo
        helpText={false}
        actionPrefix={false}
        to={<FormattedMessage {...messages.buttonText} />}
        renderSudoGate={({ openSudoModal }) => (
          <EuiContextMenuItem
            icon={isBusy ? <EuiLoadingSpinner size='m' /> : 'refresh'}
            onClick={openSudoModal}
            data-test-id='forceRestartDeployment-btn'
            disabled={isBusy}
          >
            <FormattedMessage {...messages.buttonText} />
          </EuiContextMenuItem>
        )}
      >
        <CuiPermissibleControl
          permissions={Permission.restartDeploymentEsResource}
          fillSpace={true}
        >
          <EuiContextMenuItem
            icon={isBusy ? <EuiLoadingSpinner size='m' /> : 'refresh'}
            onClick={this.openConfirmModal}
            data-test-id='forceRestartDeployment-btn'
            disabled={isBusy}
          >
            <FormattedMessage {...messages.buttonText} />
          </EuiContextMenuItem>
        </CuiPermissibleControl>

        {this.renderConfirmModal()}
      </RequiresSudo>
    )
  }

  renderConfirmModal() {
    const { isConfirmModalOpen, idPrefix, selectedStrategy } = this.state
    const { deployment } = this.props
    const downtimeOptions = [
      {
        id: `${idPrefix}__all__`,
        label: <FormattedMessage {...messages.fullRestart} />,
        value: `__all__`,
      },
    ]

    const noDowntimeOptions = [
      {
        id: `${idPrefix}__name__`,
        label: (
          <FormattedMessage
            {...messages.rolling}
            values={{
              recommended: (
                <EuiBadge color='secondary'>
                  <FormattedMessage {...messages.recommended} />
                </EuiBadge>
              ),
            }}
          />
        ),
        value: `__name__`,
      },
      {
        id: `${idPrefix}__zone__`,
        label: <FormattedMessage {...messages.zoneByZone} />,
        value: `__zone__`,
        disabled: get(deployment, [`plan`, `availabilityZones`]) < 2,
      },
    ]

    if (!isConfirmModalOpen) {
      return null
    }

    return (
      <EuiOverlayMask>
        <EuiModal onClose={this.closeConfirmModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage {...messages.title} />
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiText>
              <div data-test-id='forceRestartDeployment-modal'>
                <p>
                  <FormattedMessage {...messages.preamble} />
                </p>

                <EuiTitle size='xs'>
                  <h5>
                    <FormattedMessage {...messages.noDowntime} />
                  </h5>
                </EuiTitle>

                <EuiRadioGroup
                  data-test-id='forceRestartDeployment-no-downtime-options'
                  options={noDowntimeOptions}
                  idSelected={`${idPrefix}${selectedStrategy}`}
                  onChange={this.onChange}
                />

                <EuiTitle size='xs'>
                  <h5>
                    <FormattedMessage {...messages.withDowntime} />
                  </h5>
                </EuiTitle>

                <EuiRadioGroup
                  data-test-id='forceRestartDeployment-downtime-options'
                  options={downtimeOptions}
                  idSelected={`${idPrefix}${selectedStrategy}`}
                  onChange={this.onChange}
                />
              </div>
            </EuiText>
          </EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={this.closeConfirmModal} data-test-id='delete-text-cancel'>
              <FormattedMessage id='deployment-delete-deployment.cancel' defaultMessage='Cancel' />
            </EuiButtonEmpty>

            <EuiButton onClick={this.restart} data-test-id='confirmModalConfirmButton'>
              <FormattedMessage {...messages.confirm} />
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

  onChange = (_id: string, value: RestartStrategy) => {
    this.setState({ selectedStrategy: value })
  }

  restart = () => {
    const { restartStackDeploymentEsResource, fetchDeployment } = this.props
    const { selectedStrategy } = this.state

    Promise.resolve()
      .then(() => this.setState({ requestChainProgress: true }))
      .then(() => restartStackDeploymentEsResource(selectedStrategy))
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
                id='toasts.title-failed'
                defaultMessage='Restarting deployment failed'
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

export default RestartDeployment
