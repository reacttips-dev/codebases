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

import { EuiButton } from '@elastic/eui'

import { CuiRouterLinkButton } from '../../../cui'

import { createDeploymentUrl } from '../../../lib/urlBuilder'
import TrialModal from '../../../apps/userconsole/components/TrialModal'

type Props = {
  createDisabled: boolean
  disabled?: boolean
  restartTrial: boolean
}

type State = {
  isModalOpen: boolean
}

class CreateDeploymentLink extends Component<Props, State> {
  state = {
    isModalOpen: false,
  }

  render() {
    const { createDisabled, disabled, restartTrial } = this.props

    const message = (
      <FormattedMessage
        id='deployments-deployment-filters.create-deployment'
        defaultMessage='Create deployment'
      />
    )
    const restartMessage = (
      <FormattedMessage
        id='deployments-deployment-filters.restart-trial-create-deployment'
        defaultMessage='Restart your trial'
      />
    )

    if (disabled || (createDisabled && !restartTrial)) {
      return (
        <Fragment>
          <EuiButton fill={true} isDisabled={disabled} onClick={() => this.showModal()}>
            {message}
          </EuiButton>

          {this.renderModal()}
        </Fragment>
      )
    }

    return (
      <CuiRouterLinkButton
        data-test-id='create-deployment-link'
        to={createDeploymentUrl()}
        fill={true}
      >
        {createDisabled && restartTrial ? restartMessage : message}
      </CuiRouterLinkButton>
    )
  }

  renderModal() {
    const { isModalOpen } = this.state

    if (!isModalOpen) {
      return null
    }

    return <TrialModal close={() => this.closeModal()} />
  }

  showModal() {
    this.setState({ isModalOpen: true })
  }

  closeModal() {
    this.setState({ isModalOpen: false })
  }
}

export default CreateDeploymentLink
