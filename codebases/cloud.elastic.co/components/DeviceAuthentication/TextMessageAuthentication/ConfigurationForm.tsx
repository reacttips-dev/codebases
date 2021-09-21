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
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import { get } from 'lodash'
import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'
import SpinButton from '../../SpinButton'
import ServerErrorCallout from '../ServerErrorCallout'
import { AsyncRequestState } from '../../../types'
import { MfaDevice } from '../../../apps/userconsole/reducers/mfa/types'

interface Props extends WrappedComponentProps {
  device: MfaDevice
  enrollDevice: (phone_number: string) => void
  enrollMfaDeviceRequest: AsyncRequestState
  resetMfaEnrollment: (device: MfaDevice) => void
  onCancel: () => void
}

interface State {
  error: boolean
  phoneNumber: string
}

const messages = defineMessages({
  invalidPhoneNumber: {
    id: `text-message-authentication.invalid-phone-number`,
    defaultMessage: `Invalid phone number`,
  },
  invalidCharactersInPhoneNumber: {
    id: `text-message-authentication.invalid-character-in-phone-number.`,
    defaultMessage: `Invalid phone number. Only numbers, dash (-), plus (+), and spaces allowed.`,
  },
})

class ConfigurationForm extends PureComponent<Props, State> {
  state = {
    error: false,
    phoneNumber: '',
  }

  render() {
    const { onCancel, enrollMfaDeviceRequest } = this.props
    const { phoneNumber } = this.state
    const error = this.getErrorMessage()
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
                  id='text-message-authentication-form-label'
                  defaultMessage='Add a mobile phone number to receive security codes'
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
                required={isInvalid}
                isInvalid={isInvalid}
                placeholder='E.g. +1 555 415 1337'
                onChange={this.onChange}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFormRow>
                <SpinButton
                  size='s'
                  spin={enrollMfaDeviceRequest.inProgress}
                  onClick={this.onSubmitForm}
                  fill={true}
                  disabled={!phoneNumber || !!error}
                >
                  <FormattedMessage
                    id='text-message-authentication-form-button'
                    defaultMessage='Enable'
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

  getErrorMessage() {
    const { enrollMfaDeviceRequest, intl } = this.props
    const { formatMessage } = intl
    const enrollRequestError = enrollMfaDeviceRequest.error
    const errors = get(enrollRequestError, [`body`, `errors`])

    if (errors) {
      if (
        errors.filter(
          (requestError) => requestError.code === `authentication_provider.invalid_request`,
        ).length > 0
      ) {
        return formatMessage(messages.invalidPhoneNumber)
      }

      if (
        errors.filter((requestError) => requestError.code === `root.unexpected_error`).length > 0
      ) {
        return (
          <Fragment>
            <EuiSpacer size='s' />
            <ServerErrorCallout />
          </Fragment>
        )
      }
    }

    if (this.state.error) {
      return formatMessage(messages.invalidCharactersInPhoneNumber)
    }

    return null
  }

  onChange = (e) => {
    const regex = /^[- +]*[0-9][- +0-9]*$/
    const value = e.target.value
    const { enrollMfaDeviceRequest, resetMfaEnrollment, device } = this.props

    if (enrollMfaDeviceRequest.error) {
      resetMfaEnrollment(device)
    }

    this.setState({
      phoneNumber: e.target.value,
      error: value ? !value.match(regex) : false,
    })
  }

  onSubmitForm = () => {
    this.props.enrollDevice(this.state.phoneNumber)
  }
}

export default injectIntl(ConfigurationForm)
