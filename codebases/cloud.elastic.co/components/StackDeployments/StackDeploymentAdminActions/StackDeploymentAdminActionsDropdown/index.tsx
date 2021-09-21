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

import React, { Component, ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import {
  EuiButton,
  EuiContextMenuPanel,
  EuiContextMenuItem,
  EuiTextColor,
  EuiPopover,
} from '@elastic/eui'

import { withSmallErrorBoundary } from '../../../../cui'

import DeleteDeployment from './DeleteDeployment'
import HideDeployment from './HideDeployment'
import HideDeploymentInUserconsole from './HideDeploymentInUserconsole'
import RestartDeployment from './RestartDeployment'
import RestartStoppedDeployment from './RestartStoppedDeployment'
import StopDeployment from './StopDeployment'

import { isEsStopped } from '../../../../lib/stackDeployments'
import { deploymentEditUrl, securityUrl } from '../../../../lib/urlBuilder'

import { getConfigForKey } from '../../../../store'

import { StackDeployment } from '../../../../types'

type Props = {
  deployment: StackDeployment
  hideClusterInsteadOfDelete: boolean
  hideClusterInsteadOfStop: boolean
}

type State = {
  isPopoverOpen: boolean
}

class StackDeploymentAdminActionsDropdown extends Component<Props, State> {
  state: State = {
    isPopoverOpen: false,
  }

  render() {
    const restartButton = this.getRestartButton()
    const stopButton = this.getStopButton()
    const deleteButton = this.getDeleteButton()
    const editDeployment = this.getEditDeployment()
    const resetPassword = this.getResetPassword()

    const buttons = [editDeployment, resetPassword, restartButton, stopButton, deleteButton].filter(
      Boolean,
    ) as ReactElement[]

    return (
      <EuiPopover
        button={
          <EuiButton
            iconType='arrowDown'
            iconSide='right'
            onClick={this.onButtonClick}
            data-test-subj='deploymentActions-openActions'
          >
            <FormattedMessage id='deployment-admin-actions.manage' defaultMessage='Manage' />
          </EuiButton>
        }
        isOpen={this.state.isPopoverOpen}
        closePopover={this.closePopover}
        panelPaddingSize='none'
      >
        <EuiContextMenuPanel items={buttons} />
      </EuiPopover>
    )
  }

  onButtonClick = () => {
    this.setState((prevState) => ({
      isPopoverOpen: !prevState.isPopoverOpen,
    }))
  }

  closePopover = () => {
    this.setState({
      isPopoverOpen: false,
    })
  }

  getRestartButton = () => {
    const { deployment } = this.props
    const stopped = isEsStopped({ deployment })

    if (stopped) {
      return <RestartStoppedDeployment key='RestartStoppedDeployment' deployment={deployment} />
    }

    return <RestartDeployment key='RestartDeployment' deployment={deployment} />
  }

  getStopButton = () => {
    const { deployment, hideClusterInsteadOfStop } = this.props
    const stopped = isEsStopped({ deployment })

    if (hideClusterInsteadOfStop || stopped) {
      return null // userconsole or stopped
    }

    return <StopDeployment key='StopDeployment' deployment={deployment} />
  }

  getDeleteButton = () => {
    const { deployment, hideClusterInsteadOfDelete, hideClusterInsteadOfStop } = this.props

    const heroku = getConfigForKey(`APP_FAMILY`) === `heroku`

    if (heroku) {
      return null
    }

    if (hideClusterInsteadOfStop) {
      // userconsole
      return (
        <HideDeploymentInUserconsole key='HideDeploymentInUserconsole' deployment={deployment} />
      )
    }

    if (hideClusterInsteadOfDelete) {
      // adminconsole
      return <HideDeployment key='HideDeployment' deployment={deployment} />
    }

    // ECE
    return <DeleteDeployment key='DeleteDeployment' deployment={deployment} />
  }

  getEditDeployment() {
    const {
      deployment: { id },
    } = this.props

    return (
      <EuiContextMenuItem
        key='editDeployment'
        icon='pencil'
        data-test-id='deployment-actions-menu-edit-deployment'
      >
        <Link color='text' to={deploymentEditUrl(id)}>
          <EuiTextColor color='default'>
            <FormattedMessage
              id='deployment-admin-actions.edit-deployment'
              defaultMessage='Edit deployment'
            />
          </EuiTextColor>
        </Link>
      </EuiContextMenuItem>
    )
  }

  getResetPassword() {
    const {
      deployment: { id },
    } = this.props

    return (
      <EuiContextMenuItem
        key='resetPassword'
        icon='lock'
        data-test-id='deployment-actions-menu-reset-password'
      >
        <Link to={securityUrl(id)}>
          <EuiTextColor color='default'>
            <FormattedMessage
              id='deployment-admin-actions.reset-password'
              defaultMessage='Reset password'
            />
          </EuiTextColor>
        </Link>
      </EuiContextMenuItem>
    )
  }
}

export default withSmallErrorBoundary(StackDeploymentAdminActionsDropdown)
