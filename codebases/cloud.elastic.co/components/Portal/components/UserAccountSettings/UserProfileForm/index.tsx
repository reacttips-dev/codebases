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
  EuiCallOut,
  EuiDescribedFormGroup,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
} from '@elastic/eui'

import FormButtons from '../FormButtons'
import PasswordField from '../../../../PasswordField'
import EmailField from './EmailField'
import { addToast } from '../../../../../cui'

import validateEmail from '../../../../../lib/validateEmail'

import { SaasUserProfile, SaasUserRules } from '../../../../../lib/api/v1/types'
import { AccountUI, AsyncRequestState, UserProfileData } from '../../../../../types'

type FormFieldName = 'email' | 'first_name' | 'last_name' | 'password'
type Editing = { [K in FormFieldName]?: boolean }
type FieldValues = { [K in FormFieldName]?: string }

interface Props extends WrappedComponentProps {
  accountDetails: SaasUserProfile & SaasUserRules
  ui: AccountUI
  updateAccountDetails: (fieldValues: FieldValues) => any
  updateAccountDetailsRequest: AsyncRequestState
  resetUpdateAccountDetailsRequest: () => void
}

interface State {
  errors?: {
    email?: React.ReactChild
    password?: React.ReactChild
  }
  editing?: Editing
  fieldValues: FieldValues
  showProfileFormButtons: boolean
  newEmail?: string
}

const messages = defineMessages({
  first_name: {
    id: 'user-settings-profile.first-name',
    defaultMessage: 'First name',
  },
  last_name: {
    id: 'user-settings-profile.last-name',
    defaultMessage: 'Last name',
  },
  password: {
    id: 'user-settings-profile.current-password',
    defaultMessage: 'Current Password',
  },
})

const toastText = {
  profileUpdateSuccess: {
    color: 'success',
    title: (
      <FormattedMessage
        id='user-settings.profile-update.success'
        defaultMessage='Your profile was updated'
      />
    ),
  },
  emailDidChange: {
    color: 'success',
    title: (
      <FormattedMessage
        id='user-settings.profile-update.email-changed-notification'
        defaultMessage='Email change confirmed'
      />
    ),
  },
}

class UserProfileForm extends PureComponent<Props, State> {
  state = { ...this.getDefaultState(), newEmail: undefined }

  render() {
    const { intl, updateAccountDetailsRequest } = this.props
    const { formatMessage } = intl
    const { fieldValues, showProfileFormButtons } = this.state
    const canSubmitForm = this.isFormSubmittable()

    return (
      <form className='user-settings-profile-form'>
        <EuiForm>
          <EuiDescribedFormGroup
            title={
              <h3>
                <FormattedMessage id='user-settings-profile-title' defaultMessage='Profile' />
              </h3>
            }
            titleSize='xs'
            description={
              <p>
                <FormattedMessage
                  id='user-settings-profile-email-help-text'
                  defaultMessage='Your email address is used to sign in and should we need to contact you.'
                />
              </p>
            }
          >
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiFormRow label={formatMessage(messages.first_name)}>
                  <EuiFieldText
                    name='first_name'
                    onChange={this.onChangeProfileName}
                    value={fieldValues.first_name}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label={formatMessage(messages.last_name)}>
                  <EuiFieldText
                    name='last_name'
                    onChange={this.onChangeProfileName}
                    value={fieldValues.last_name}
                  />
                </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size='m' />
            {this.renderEmailField()}
            {this.renderPasswordField()}
            {this.renderErrorCallout()}
            {showProfileFormButtons && (
              <Fragment>
                <EuiSpacer size='m' />
                <FormButtons
                  disableSubmit={!canSubmitForm}
                  inProgress={updateAccountDetailsRequest.inProgress}
                  onSubmit={this.updateAccountDetails}
                  onCancel={this.onDiscardChanges}
                />
              </Fragment>
            )}
          </EuiDescribedFormGroup>
        </EuiForm>
      </form>
    )
  }

  renderEmailField() {
    const {
      updateAccountDetailsRequest,
      ui,
      accountDetails: { is_profile_editable },
    } = this.props
    const { editing, errors, fieldValues, newEmail } = this.state
    const isInvalid = !!errors.email

    return (
      <EmailField
        editing={editing.email}
        disabled={!is_profile_editable}
        error={errors.email}
        isInvalid={isInvalid}
        onChange={this.onChangeEmail}
        value={fieldValues.email}
        emailDidChange={ui.emailDidChange}
        emailUpdateRequested={updateAccountDetailsRequest.isDone && newEmail}
        onClickEdit={this.onClickEditEmail}
        newEmail={newEmail}
      />
    )
  }

  renderPasswordField() {
    const { intl } = this.props
    const { formatMessage } = intl
    const { errors, editing } = this.state

    if (editing.email) {
      return (
        <PasswordField
          isInvalid={!!errors.password}
          error={errors.password}
          name='password'
          label={formatMessage(messages.password)}
          onChange={this.onChangePasswordInput}
        />
      )
    }

    return null
  }

  renderErrorCallout() {
    const { error } = this.props.updateAccountDetailsRequest
    const errors = get(error, [`body`, `errors`], null)

    if (errors) {
      const responseStatusCode = get(error, [`response`, `status`])

      if (responseStatusCode !== 403) {
        const errorDetails = get(error, [`body`, `errors`, `0`], null)

        if (errorDetails) {
          if (errorDetails.code === 'user.rate_limited') {
            return this.getErrorCallout(
              <FormattedMessage
                id='update-profile.too-many-requests'
                defaultMessage='Too many requests'
              />,
            )
          }

          return this.getErrorCallout(errorDetails.message)
        }
      }
    }

    return null
  }

  getErrorCallout(content) {
    return (
      <Fragment>
        <EuiCallOut
          title={
            <FormattedMessage id='update-profile.failed' defaultMessage='Error updating profile' />
          }
          color='danger'
          iconType='alert'
        >
          {content}
        </EuiCallOut>
        <EuiSpacer />
      </Fragment>
    )
  }

  getDefaultState() {
    const { accountDetails } = this.props
    const { email } = accountDetails
    const data = accountDetails.data as UserProfileData
    const first_name = data && data.first_name
    const last_name = data && data.last_name
    const fieldValues = {
      email: email || '',
      first_name: first_name || '',
      last_name: last_name || '',
      password: undefined,
    }
    return {
      errors: {
        email: undefined,
        password: undefined,
      },
      editing: {
        email: false,
        first_name: false,
        last_name: false,
      },
      fieldValues,
      showProfileFormButtons: false,
    }
  }

  isEditingFormFields() {
    const { editing } = this.state
    return Object.values(editing).some((edited) => edited)
  }

  isFormSubmittable() {
    const { editing, fieldValues } = this.state
    const hasPassword = !!fieldValues.password

    if (!editing.email) {
      return editing.first_name || editing.last_name
    }

    return fieldValues.email && this.isFieldEdited('email', fieldValues.email) && hasPassword
  }

  isFieldEdited(field, value) {
    const { accountDetails } = this.props
    const currentValue = accountDetails[field]
    return currentValue !== value
  }

  onChangeProfileName = (e) => {
    const input = e.target
    const field = input.name
    const value = input.value

    this.resetRequest()
    this.setState((prevState) => {
      const fieldEdited = this.isFieldEdited(field, value)
      return {
        editing: { ...prevState.editing, [field]: fieldEdited },
        fieldValues: {
          ...prevState.fieldValues,
          [field]: input.value,
        },
        showProfileFormButtons: fieldEdited || this.isEditingFormFields(),
      }
    })
  }

  onChangeEmail = (e) => {
    const email = e.target.value
    this.setState((prevState) => ({
      errors: { email: undefined },
      fieldValues: {
        ...prevState.fieldValues,
        email,
      },
    }))
  }

  resetRequest() {
    const { updateAccountDetailsRequest } = this.props

    if (updateAccountDetailsRequest.error || updateAccountDetailsRequest.isDone) {
      this.props.resetUpdateAccountDetailsRequest()
    }
  }

  onChangePasswordInput = (input) => {
    this.setState((prevState) => ({
      errors: { password: undefined },
      fieldValues: {
        ...prevState.fieldValues,
        password: input.value,
      },
    }))
  }

  onClickEditEmail = () => {
    this.resetRequest()
    this.setState((prevState) => {
      const editing = prevState.editing || {}
      return {
        editing: {
          ...editing,
          email: true,
        },
        fieldValues: {
          ...prevState.fieldValues,
          email: '',
        },
        showProfileFormButtons: true,
      }
    })
  }

  onDiscardChanges = () => {
    this.setState(this.getDefaultState(), () => this.props.resetUpdateAccountDetailsRequest())
  }

  makeClientError(error) {
    const responseStatusCode = get(error, [`response`, `status`])

    if (responseStatusCode === 400) {
      const errorDetail = get(error, [`body`, `detail`])

      if (errorDetail && errorDetail.indexOf('email') > -1) {
        this.setState({
          errors: {
            email: errorDetail,
          },
        })
      }
    }

    if (responseStatusCode === 403) {
      this.setState({
        errors: {
          password: (
            <FormattedMessage
              id='update-profile.email-form.password-error'
              defaultMessage='Invalid password'
            />
          ),
        },
      })
    }
  }

  isEmailValid(email) {
    const isValid = validateEmail(email)

    if (!isValid) {
      this.setState({
        errors: {
          email: (
            <FormattedMessage
              id='update-profile.email-form.invalid-email'
              defaultMessage='Invalid email address'
            />
          ),
        },
      })
    }

    return isValid
  }

  updateAccountDetails = () => {
    const { editing, fieldValues } = this.state

    if (editing.email && !this.isEmailValid(fieldValues.email)) {
      return
    }

    this.props
      .updateAccountDetails(
        Object.keys(fieldValues).reduce((accumulator, key) => {
          if (key === 'password' || editing[key]) {
            accumulator[key] = fieldValues[key]
          }

          return accumulator
        }, {}),
      )
      .then(() => {
        if (editing.first_name || editing.last_name) {
          addToast({
            ...toastText.profileUpdateSuccess,
          })
        }

        this.setState({
          ...this.getDefaultState(),
          newEmail: editing.email ? fieldValues.email : undefined,
        })
      })
      .catch((e) => this.makeClientError(e))
  }
}

export default injectIntl(UserProfileForm)
