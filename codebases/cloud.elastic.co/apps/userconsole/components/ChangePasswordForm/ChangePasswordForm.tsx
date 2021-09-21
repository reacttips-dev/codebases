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

import React, { PureComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiForm, EuiFormRow, EuiSpacer } from '@elastic/eui'

import ChangePasswordFormErrorCallout from './ErrorCallout'

import PasswordField from '../../../../components/PasswordField'
import SpinButton from '../../../../components/SpinButton'

import { AsyncRequestState } from '../../../../types'

interface Props {
  email: string
  expires: number
  activationHash: string | undefined
  isReset: boolean
  loginRequest: AsyncRequestState
  setInitialPassword: (args: {
    email: string
    expires: number
    hash: string
    password: string
  }) => void
  setInitialPasswordRequest: AsyncRequestState
}

interface State {
  newPassword: string
  isValidPassword: boolean
}

class ChangePasswordForm extends PureComponent<Props, State> {
  state = {
    newPassword: '',
    isValidPassword: false,
  }

  render(): ReactElement {
    return (
      <div data-test-id='set-password-form' className='set-password-form'>
        {this.renderForm()}
      </div>
    )
  }

  renderForm(): ReactElement {
    const { loginRequest, setInitialPasswordRequest, isReset } = this.props
    const { isValidPassword } = this.state

    return (
      <EuiForm>
        <PasswordField
          hideLockIcon={true}
          name='newPassword'
          label={<FormattedMessage id='set-password.new-password' defaultMessage='New password' />}
          onChange={this.onChange}
          hasStrengthIndicator={true}
        />

        <EuiSpacer size='l' />

        <EuiFormRow>
          <SpinButton
            onClick={this.onSubmit}
            disabled={!isValidPassword}
            spin={setInitialPasswordRequest.inProgress || loginRequest.inProgress}
            buttonProps={{ fullWidth: true }}
            fill={true}
            data-test-id='update-password'
            className='cloud-landing-page-form-submit-button'
          >
            {isReset ? (
              <FormattedMessage
                id='set-password.update-password-button'
                defaultMessage='Update password and login'
              />
            ) : (
              <FormattedMessage
                id='set-password.set-password-button'
                defaultMessage='Set password and login'
              />
            )}
          </SpinButton>
        </EuiFormRow>
        <ChangePasswordFormErrorCallout error={setInitialPasswordRequest.error} />
      </EuiForm>
    )
  }

  onChange = (input: HTMLInputElement, { isValidPassword }: { isValidPassword: boolean }): void => {
    this.setState({ newPassword: input.value, isValidPassword })
  }

  onSubmit = (): void => {
    const { email, expires, activationHash } = this.props
    const password = this.state.newPassword

    if (activationHash) {
      this.props.setInitialPassword({ email, expires, hash: activationHash, password })
    }
  }
}

export default ChangePasswordForm
