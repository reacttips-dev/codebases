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

import React, { Fragment, PureComponent, ReactElement } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { get } from 'lodash'

import {
  EuiButton,
  EuiCallOut,
  EuiDescribedFormGroup,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
} from '@elastic/eui'

import { CuiAlert, addToast } from '../../../../../cui'

import FormButtons from '../FormButtons'

import ChangePassword from '../../../../PasswordField/ChangePassword'
import { passwordErrorMessages } from '../../../../PasswordField/errorMessages'

import { SaasUserProfile, SaasUserRules } from '../../../../../lib/api/v1/types'
import { AsyncRequestState } from '../../../../../types'

import './changePasswordForm.scss'

type FormFieldName = 'oldPassword' | 'newPassword'
type FieldValues = { [K in FormFieldName]?: string }

interface Props {
  accountDetails: SaasUserProfile & SaasUserRules
  updateAccountPassword: (args: { oldPassword: string; newPassword: string; email: string }) => any
  updateAccountPasswordRequest: AsyncRequestState
  resetUpdateAccountPasswordRequest: () => void
}

interface State {
  editing: boolean
  fieldValues: FieldValues
  invalidCurrentPasswordError?: React.ReactChild
  isValidPassword: boolean
}

const messages = defineMessages({
  password: {
    id: 'user-settings-profile.password',
    defaultMessage: 'Password',
  },
})

const toastText = {
  passwordUpdateSuccess: {
    title: (
      <FormattedMessage
        id='user-settings.password-update.success'
        defaultMessage='Your password was updated'
      />
    ),
    color: 'success',
  },
}

class ChangePasswordForm extends PureComponent<Props, State> {
  state = this.getDefaultState()

  render(): ReactElement {
    return (
      <form className='user-settings-profile-change-password'>
        <EuiForm>
          <EuiDescribedFormGroup
            title={
              <h3>
                <FormattedMessage {...messages.password} />
              </h3>
            }
          >
            {this.renderChangePasswordFields()}
          </EuiDescribedFormGroup>
        </EuiForm>
      </form>
    )
  }

  renderChangePasswordFields(): ReactElement {
    const { updateAccountPasswordRequest } = this.props
    const { editing, invalidCurrentPasswordError } = this.state
    const canSubmitForm = this.isFormSubmittable()

    if (!editing) {
      return (
        <EuiFormRow hasEmptyLabelSpace={true}>
          <EuiButton
            onClick={this.onClickChangePassword}
            className='user-settings-profile-card-button-password'
          >
            <FormattedMessage
              id='user-settings-profile-change-password'
              defaultMessage='Change password'
            />
          </EuiButton>
        </EuiFormRow>
      )
    }

    return (
      <Fragment>
        <ChangePassword
          onChange={this.onChangePassword}
          invalidCurrentPasswordError={invalidCurrentPasswordError}
        />
        <EuiSpacer size='m' />
        {this.renderErrorCallout()}
        <FormButtons
          disableSubmit={!canSubmitForm}
          inProgress={updateAccountPasswordRequest.inProgress}
          onSubmit={this.onFormSubmit}
          onCancel={this.onDiscardChanges}
        />
      </Fragment>
    )
  }

  renderErrorCallout(): ReactElement | null {
    const { updateAccountPasswordRequest } = this.props
    const { error } = updateAccountPasswordRequest

    if (!error) {
      return null
    }

    const responseStatusCode = get(error, [`response`, `status`])

    if (responseStatusCode !== 400) {
      return (
        <Fragment>
          <CuiAlert type='error'>{error}</CuiAlert>
          <EuiSpacer size='m' />
        </Fragment>
      )
    }

    const errorDetails = get(error, [`body`], {})
    const errorHintMessage = passwordErrorMessages[errorDetails.hint]

    if (errorHintMessage) {
      return this.renderErrorCalloutComponent(<FormattedMessage {...errorHintMessage} />)
    }

    const errorMessage = get(error, [`body`, `msg`])

    if (errorMessage && errorMessage.includes('password')) {
      return this.renderErrorCalloutComponent(errorDetails.detail)
    }

    return (
      <Fragment>
        <CuiAlert type='error'>{error}</CuiAlert>
        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderErrorCalloutComponent(children: ReactElement): ReactElement {
    return (
      <Fragment>
        <EuiCallOut
          data-test-id='user-settings-profile-change-password-failed'
          title={
            <FormattedMessage
              id='user-settings-profile-change-password.failed'
              defaultMessage='Error setting password'
            />
          }
          color='danger'
          iconType='alert'
        >
          {children}
        </EuiCallOut>
        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  getDefaultState(): State {
    return {
      editing: false,
      fieldValues: {
        oldPassword: '',
        newPassword: '',
      },
      invalidCurrentPasswordError: undefined,
      isValidPassword: false,
    }
  }

  onClickChangePassword = (): void => {
    this.setState({ editing: true })
  }

  isFormSubmittable(): boolean {
    const { fieldValues, isValidPassword } = this.state
    return !!fieldValues.newPassword && !!fieldValues.oldPassword && isValidPassword
  }

  onChangePassword = (
    input: HTMLInputElement,
    { isValidPassword }: { isValidPassword: boolean },
  ): void => {
    const name = input.name
    const value = input.value

    this.resetUpdatePasswordRequest()
    this.setState((prevState) => {
      const newState = {
        fieldValues: {
          ...prevState.fieldValues,
          [name]: value,
        },
        invalidCurrentPasswordError: prevState.invalidCurrentPasswordError,
        isValidPassword,
      }

      if (name === 'oldPassword') {
        newState.invalidCurrentPasswordError = undefined
      }

      return newState
    })
  }

  onDiscardChanges = (): void => {
    this.setState(this.getDefaultState(), () => this.props.resetUpdateAccountPasswordRequest())
  }

  resetUpdatePasswordRequest(): void {
    const { updateAccountPasswordRequest } = this.props

    if (updateAccountPasswordRequest.error) {
      this.props.resetUpdateAccountPasswordRequest()
    }
  }

  onFormSubmit = (): void => {
    const { oldPassword, newPassword } = this.state.fieldValues
    const { email } = this.props.accountDetails

    if (oldPassword && newPassword) {
      this.props
        .updateAccountPassword({ oldPassword, newPassword, email })
        .then(() => {
          addToast({
            ...toastText.passwordUpdateSuccess,
          })
          this.setState(this.getDefaultState())
        })
        .catch((e) => this.makeApiError(e))
    }
  }

  makeApiError(error: Error): null {
    const responseStatusCode = get(error, [`response`, `status`])

    if (responseStatusCode === 403) {
      this.setState({
        invalidCurrentPasswordError: (
          <FormattedMessage
            id='update-profile.change-password.invalid-current-password-error'
            defaultMessage='Invalid password'
          />
        ),
      })
    }

    return null
  }
}

export default ChangePasswordForm
