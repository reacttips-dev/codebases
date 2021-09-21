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

import { EuiModal, EuiOverlayMask, EuiProgress } from '@elastic/eui'

import ExpiredTrialModalBody from './ExpiredTrialModalBody'
import ExtendTrialModalBody from './ExtendTrialModalBody'
import TrialModalBody from './TrialModalBody'

import { AsyncRequestState, ProfileState, Theme } from '../../../../types'

import './trialModal.scss'

type Props = {
  close: () => void
  extendTrial: (selectedAnswer, textAreaValue) => Promise<any>
  extendTrialRequest: AsyncRequestState
  profile: NonNullable<ProfileState>
  resetExtendTrial: () => void
  theme: Theme
}

type State = {
  showExtendTrialModal: boolean
}

class TrialModal extends Component<Props, State> {
  state: State = {
    showExtendTrialModal: false,
  }

  componentWillUnmount() {
    const { resetExtendTrial } = this.props
    resetExtendTrial()
  }

  render() {
    const { close, extendTrialRequest } = this.props

    return (
      <EuiOverlayMask>
        <EuiModal
          className='trialModal'
          onClose={() => close()}
          data-test-id='trial-expired-modal'
          maxWidth='600px'
        >
          {extendTrialRequest.inProgress && (
            <EuiProgress position='absolute' size='xs' color='accent' />
          )}

          {this.renderBody()}
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  renderBody = () => {
    const { close, profile, theme, extendTrial, extendTrialRequest } = this.props
    const { showExtendTrialModal } = this.state

    if (profile.hasExpiredTrial) {
      return showExtendTrialModal ? (
        <ExtendTrialModalBody
          close={close}
          extendTrial={extendTrial}
          requestTrialExtension={this.requestTrialExtension}
          extendTrialRequest={extendTrialRequest}
        />
      ) : (
        <ExpiredTrialModalBody
          close={close}
          onClick={this.showExtendTrialModal}
          showExtendTrialModal={showExtendTrialModal}
          theme={theme}
          canExtendTrial={profile.canExtendTrial}
        />
      )
    }

    return <TrialModalBody close={close} theme={theme} />
  }

  requestTrialExtension = (selectedAnswer, textAreaValue) => {
    const { close, extendTrial } = this.props
    extendTrial(selectedAnswer, textAreaValue).then(() => close())
  }

  showExtendTrialModal = () => {
    this.setState({ showExtendTrialModal: true })
  }
}

export default TrialModal
