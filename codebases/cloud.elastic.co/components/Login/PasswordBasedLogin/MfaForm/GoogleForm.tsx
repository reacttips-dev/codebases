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

import { EuiButtonEmpty, EuiFieldText, EuiFormRow, EuiSpacer, EuiText } from '@elastic/eui'

import { SubmitButton, errorMessage, switchToSmsLinkText } from './parts'

import { CuiRouterLinkButtonEmpty } from '../../../../cui'

import { AsyncRequestState, DEVICE_TYPES } from '../../../../types'

import { logoutUrl } from '../../../../lib/urlBuilder'

const googleLabel = <FormattedMessage id='mfa.google-label' defaultMessage='6-digit code' />

type Props = {
  onSubmit: (passCode: string) => void
  showSwitchToSmsLink: boolean
  switchToDevice: (deviceType: string) => void
  resetSubmitMfaResponseRequest: () => void
  submitMfaResponseRequest: AsyncRequestState
}

type State = {
  passCode: string
}

export default class GoogleForm extends Component<Props, State> {
  state: State = {
    passCode: ``,
  }

  render() {
    const { submitMfaResponseRequest, showSwitchToSmsLink, switchToDevice } = this.props
    const { passCode } = this.state
    const { error } = submitMfaResponseRequest
    const secondButton = showSwitchToSmsLink ? (
      <EuiText textAlign='center'>
        <EuiButtonEmpty
          data-test-id='switch-to-sms'
          onClick={() => switchToDevice(DEVICE_TYPES.SMS)}
          disabled={submitMfaResponseRequest.inProgress}
        >
          {switchToSmsLinkText}
        </EuiButtonEmpty>
      </EuiText>
    ) : (
      <EuiText textAlign='center'>
        <CuiRouterLinkButtonEmpty to={logoutUrl()}>
          <FormattedMessage id='mfa.google-cancel' defaultMessage='Cancel' />
        </CuiRouterLinkButtonEmpty>
      </EuiText>
    )
    return (
      <Fragment>
        <EuiText color='subdued' textAlign='center'>
          <FormattedMessage
            id='mfa.intro-text'
            defaultMessage='Enter the secure 6-digit code from your authentication app.'
          />
        </EuiText>

        <EuiSpacer size='l' />

        <form onSubmit={this.submit} data-test-id='multifactor-form'>
          <EuiFormRow
            label={googleLabel}
            isInvalid={!!error}
            error={error ? [errorMessage] : undefined}
          >
            <EuiFieldText
              autoFocus={true}
              icon='lock'
              isInvalid={!!error}
              value={passCode}
              data-test-id='google-mfa-token'
              onChange={this.onChange}
            />
          </EuiFormRow>

          <EuiSpacer />

          <SubmitButton
            isDisabled={!passCode.trim()}
            inProgress={submitMfaResponseRequest.inProgress}
          />

          <EuiSpacer />

          {secondButton}
        </form>
      </Fragment>
    )
  }

  onChange = (e) => {
    const {
      submitMfaResponseRequest: { error },
      resetSubmitMfaResponseRequest,
    } = this.props

    if (error) {
      resetSubmitMfaResponseRequest()
    }

    this.setState({ passCode: e.target.value })
  }

  submit = (e) => {
    e.preventDefault()
    this.props.onSubmit(this.state.passCode)
  }
}
