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
import { get } from 'lodash'

import { EuiFieldText, EuiFormRow, EuiButtonEmpty, EuiSpacer, EuiText } from '@elastic/eui'

import { addToast, CuiRouterLinkButtonEmpty } from '../../../../cui'

import { logoutUrl } from '../../../../lib/urlBuilder'

import { DEVICE_TYPES } from '../../../../reducers/auth/types'

import { SubmitButton, errorMessage } from './parts'
import { AsyncRequestState } from '../../../../types'

type Props = {
  onSubmit: (pass_code: string) => void
  showBackToGoogleLink: boolean
  switchToDevice: (deviceType: string) => void
  submitMfaResponseRequest: AsyncRequestState
  sendSms: () => Promise<any>
}

type State = {
  passCode: string
}

const smsLabel = <FormattedMessage id='mfa.sms-label' defaultMessage='6-digit code' />

const smsCodeRateLimitErrorText = (
  <FormattedMessage
    id='mfa.sms-code-ratelimit-error'
    defaultMessage="We couldn't send a code just now. Wait one minute, then try again."
  />
)
const smsCodeOtherErrorText = (
  <FormattedMessage id='mfa.sms-code-error' defaultMessage='Error sending secure code' />
)
const resendSmsText = <FormattedMessage id='mfa.resend-sms' defaultMessage='Send a new code' />

export default class SmsForm extends Component<Props, State> {
  state: State = {
    passCode: ``,
  }

  componentDidMount() {
    this.sendSms()
  }

  render() {
    const { submitMfaResponseRequest, switchToDevice, showBackToGoogleLink } = this.props
    const { passCode } = this.state
    const { error } = submitMfaResponseRequest
    const invalid = Boolean(error)

    return (
      <Fragment>
        <EuiText color='subdued' textAlign='center'>
          <FormattedMessage
            id='mfa.sms.intro-text'
            defaultMessage='We’ve sent an SMS with a 6-digit code to your phone.'
          />

          <EuiButtonEmpty
            className='resendSmsButton'
            data-test-id='resend-sms-button'
            onClick={this.sendSms}
          >
            {resendSmsText}
          </EuiButtonEmpty>
        </EuiText>

        <EuiSpacer size='l' />

        <form onSubmit={this.submit}>
          <EuiFormRow
            label={smsLabel}
            isInvalid={invalid}
            error={invalid ? [errorMessage] : undefined}
          >
            <EuiFieldText
              icon='lock'
              isInvalid={invalid}
              value={passCode}
              onChange={(e) => this.setState({ passCode: e.target.value })}
            />
          </EuiFormRow>

          <EuiSpacer />

          <SubmitButton
            isDisabled={!passCode.trim()}
            inProgress={submitMfaResponseRequest.inProgress}
          />

          <EuiSpacer />

          {showBackToGoogleLink ? (
            <EuiText textAlign='center' size='m'>
              <EuiButtonEmpty
                data-test-id='switch-to-google'
                onClick={() => switchToDevice(DEVICE_TYPES.GOOGLE)}
              >
                <FormattedMessage id='mfa.google-cancel' defaultMessage='Cancel' />
              </EuiButtonEmpty>
            </EuiText>
          ) : (
            <EuiText textAlign='center' size='m'>
              <CuiRouterLinkButtonEmpty data-test-id='switch-to-google' to={logoutUrl()}>
                <FormattedMessage id='mfa.google-cancel' defaultMessage='Cancel' />
              </CuiRouterLinkButtonEmpty>
            </EuiText>
          )}
        </form>
      </Fragment>
    )
  }

  submit = (e) => {
    e.preventDefault()
    this.props.onSubmit(this.state.passCode)
    return false
  }

  sendSms = () => {
    const { sendSms } = this.props
    return sendSms().then(
      () => {
        addToast({
          id: 'smsSent',
          family: 'mfa',
          title: (
            <FormattedMessage
              id='mfa.security-code-toast-title'
              defaultMessage='Security code sent succesfully'
            />
          ),
          text: (
            <FormattedMessage
              id='mfa.security-code-toast-text'
              defaultMessage='Sent a new 6 digit code to your registered phone number'
            />
          ),
          color: 'success',
        })
        return null
      },
      (error) => {
        const status = get(error, [`response`, `status`])
        const sendingSmsError = status === 429 ? smsCodeRateLimitErrorText : smsCodeOtherErrorText
        addToast({
          id: 'smsSent',
          family: 'mfa',
          title: (
            <FormattedMessage
              id='mfa.security-code-toast-error'
              defaultMessage='Security code Error'
            />
          ),
          text: sendingSmsError,
          color: 'danger',
        })
      },
    )
  }
}
