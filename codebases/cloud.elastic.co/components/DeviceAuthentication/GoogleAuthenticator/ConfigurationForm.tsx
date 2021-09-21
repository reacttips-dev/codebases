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
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiLoadingSpinner,
  EuiSpacer,
  EuiStepProps,
  EuiSteps,
  EuiText,
} from '@elastic/eui'

import SpinButton from '../../SpinButton'
import ServerErrorCallout from '../ServerErrorCallout'
import { MfaDevice } from '../../../apps/userconsole/reducers/mfa/types'
import { AsyncRequestState } from '../../../types'

interface Props extends WrappedComponentProps {
  device: MfaDevice
  resetMfaEnrollment: (device: MfaDevice) => void
  enrollMfaDeviceRequest: AsyncRequestState
  enableMfaDeviceRequest: AsyncRequestState
  activateMfaDeviceRequest: AsyncRequestState
  onSubmitForm: (QRCode: string) => void
  onCancel: () => void
}

interface State {
  QRCode: string
}

const messages = defineMessages({
  scanQRCode: {
    id: `google-authenticator.scan-qr-code`,
    defaultMessage: `Scan QR code`,
  },
  scanQRCodeInfo: {
    id: `google-authenticator.scan-qr-code-info`,
    defaultMessage: `Use the Google authenticator app to scan the QR code below`,
  },
  enterPassCode: {
    id: `google-authenticator.enter-password`,
    defaultMessage: `Enter passcode`,
  },
  enterPassCodeInfo: {
    id: `google-authenticator.enter-password-info`,
    defaultMessage: `Enter the 6 digit auth.elastic.co passcode`,
  },
  invalidPasscode: {
    id: `google-authenticator.invalid-pass-code`,
    defaultMessage: `Invalid passcode`,
  },
})

class ConfigurationForm extends PureComponent<Props, State> {
  state = {
    QRCode: '',
  }

  render() {
    const { activateMfaDeviceRequest, enableMfaDeviceRequest, intl } = this.props
    const activateDeviceInProgress =
      activateMfaDeviceRequest.inProgress || enableMfaDeviceRequest.inProgress
    const { formatMessage } = intl
    const steps: EuiStepProps[] = [
      {
        headingElement: 'h3',
        title: formatMessage(messages.scanQRCode),
        children: (
          <EuiFlexGroup responsive={false} direction='column'>
            <EuiFlexItem>
              <EuiText size='s'>{formatMessage(messages.scanQRCodeInfo)}</EuiText>
            </EuiFlexItem>
            {this.renderQRCode()}
          </EuiFlexGroup>
        ),
      },
      {
        className: 'google-authenticator-pass-code-form',
        title: formatMessage(messages.enterPassCode),
        children: this.renderPassCodeForm(activateDeviceInProgress),
      },
      {
        title: '',
        children: this.renderFormButtons(activateDeviceInProgress),
      },
    ]

    return (
      <EuiForm>
        <EuiSpacer size='s' />
        <EuiSteps steps={steps} />
      </EuiForm>
    )
  }

  renderQRCode() {
    const { device, enrollMfaDeviceRequest, intl } = this.props
    const { formatMessage } = intl
    const googleUrl = device.qr_code && device.qr_code.url
    const errors = get(enrollMfaDeviceRequest, [`error`, `body`, `errors`])

    if (enrollMfaDeviceRequest.inProgress) {
      return <EuiLoadingSpinner />
    }

    if (
      errors &&
      errors.filter((requestError) => requestError.code === `root.unexpected_error`).length > 0
    ) {
      return (
        <EuiFlexItem grow={false}>
          <ServerErrorCallout />
        </EuiFlexItem>
      )
    }

    return (
      <EuiFlexItem style={{ maxWidth: 164 }}>
        <img src={googleUrl} alt={formatMessage(messages.scanQRCode)} />
      </EuiFlexItem>
    )
  }

  renderPassCodeForm(activateDeviceInProgress) {
    const { intl } = this.props
    const { QRCode } = this.state
    const { formatMessage } = intl
    const error = this.getError()
    const isInvalid = !!error

    return (
      <EuiFormRow
        isInvalid={isInvalid}
        error={error}
        label={
          <Fragment>
            <EuiText size='s'>{formatMessage(messages.enterPassCodeInfo)}</EuiText>
            <EuiSpacer size='s' />
          </Fragment>
        }
      >
        <EuiFieldText
          value={QRCode}
          compressed={true}
          required={isInvalid}
          isInvalid={isInvalid}
          disabled={activateDeviceInProgress}
          maxLength={6}
          name='passcode'
          placeholder='E.g. 123456'
          data-test-id='enable-google-mfa-token'
          onChange={this.onChange}
        />
      </EuiFormRow>
    )
  }

  renderFormButtons(activateDeviceInProgress) {
    const { QRCode } = this.state
    const hasValidQRCode = QRCode.length === 6

    return (
      <Fragment>
        <EuiSpacer size='m' />
        <EuiFormRow>
          <EuiFlexGroup style={{ maxWidth: 200 }} alignItems='center'>
            <EuiFlexItem grow={2}>
              <SpinButton
                size='s'
                spin={activateDeviceInProgress}
                data-test-id='confirm-google-mfa-token'
                className='google-authenticator-enable-device'
                onClick={this.onSubmitForm}
                fill={true}
                disabled={!hasValidQRCode}
              >
                <FormattedMessage
                  id='google-authenticator.enable-device'
                  defaultMessage='Enable device'
                />
              </SpinButton>
            </EuiFlexItem>
            <EuiFlexItem grow={3}>
              <EuiButtonEmpty onClick={this.props.onCancel} flush='left'>
                <FormattedMessage id='google-authenticator.cancel' defaultMessage='Cancel' />
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFormRow>
      </Fragment>
    )
  }

  onSubmitForm = () => this.props.onSubmitForm(this.state.QRCode)

  getError() {
    const { activateMfaDeviceRequest, intl } = this.props
    const { formatMessage } = intl
    const activateMfaDeviceError = activateMfaDeviceRequest.error

    if (
      activateMfaDeviceError &&
      get(activateMfaDeviceError, [`body`, `errors`]).filter(
        (requestError) => requestError.code === `authentication_provider.invalid_request`,
      ).length > 0
    ) {
      return formatMessage(messages.invalidPasscode)
    }

    return null
  }

  onChange = (e) => {
    const regex = /^\d*$/
    const QRCode = e.target.value
    const { activateMfaDeviceRequest, resetMfaEnrollment, device } = this.props

    if (activateMfaDeviceRequest.error) {
      resetMfaEnrollment(device)
    }

    if (!QRCode || regex.test(QRCode)) {
      this.setState({ QRCode })
    }
  }
}

export default injectIntl(ConfigurationForm)
