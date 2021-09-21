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

import React, { Fragment, PureComponent } from 'react'
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'
import { get } from 'lodash'
import {
  EuiButtonEmpty,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'
import { AsyncRequestState } from '../../../types'
import SpinButton from '../../SpinButton'

interface Props extends WrappedComponentProps {
  activateMfaDeviceRequest: AsyncRequestState
  onCancel: () => void
  activateDevice: (phone_number: string) => void
}

interface State {
  passCode: string
}

const messages = defineMessages({
  invalidPassCode: {
    id: `text-message-authentication.invalid-pass-code`,
    defaultMessage: `This verification code entered is not valid.`,
  },
})

class ActivateDevice extends PureComponent<Props, State> {
  state = {
    passCode: '',
  }

  render() {
    const { onCancel, activateMfaDeviceRequest } = this.props
    const { passCode } = this.state
    const error = this.getError()
    const isInvalid = !!error

    return (
      <EuiForm>
        <EuiFormRow
          isInvalid={isInvalid}
          error={error}
          label={
            <Fragment>
              <EuiText size='s'>
                <FormattedMessage
                  id='text-message-authentication-verification-form-label'
                  defaultMessage='Insert the 6 digit password sent to your SMS device'
                />
              </EuiText>
              <EuiSpacer size='s' />
            </Fragment>
          }
        >
          <EuiFlexGroup gutterSize='s'>
            <EuiFlexItem>
              <EuiFieldText
                compressed={true}
                maxLength={6}
                disabled={activateMfaDeviceRequest.inProgress}
                required={isInvalid}
                isInvalid={isInvalid}
                placeholder='123456'
                onChange={this.onChange}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFormRow>
                <SpinButton
                  size='s'
                  spin={activateMfaDeviceRequest.inProgress}
                  className='google-authenticator-enable-device'
                  onClick={this.onSubmitForm}
                  fill={true}
                  disabled={passCode.length !== 6}
                >
                  <FormattedMessage
                    id='text-message-authentication-form-confirm-button'
                    defaultMessage='Confirm'
                  />
                </SpinButton>
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFormRow>
        <EuiButtonEmpty
          onClick={onCancel}
          className='text-message-authentication-form-cancel-button'
        >
          <FormattedMessage
            id='text-message-authentication-form-cancel-button'
            defaultMessage='Cancel'
          />
        </EuiButtonEmpty>
      </EuiForm>
    )
  }

  getError() {
    const { activateMfaDeviceRequest, intl } = this.props
    const { formatMessage } = intl
    const activateRequestError = activateMfaDeviceRequest.error

    if (
      activateRequestError &&
      get(activateRequestError, [`body`, `errors`]).filter(
        (requestError) => requestError.code === `authentication_provider.invalid_request`,
      ).length > 0
    ) {
      return formatMessage(messages.invalidPassCode)
    }

    return null
  }

  onChange = (e) => {
    this.setState({ passCode: e.target.value })
  }

  onSubmitForm = () => {
    this.props.activateDevice(this.state.passCode)
  }
}

export default injectIntl(ActivateDevice)
