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

import { forEach, get, isEmpty } from 'lodash'

import React, { Component, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import FlipMove from 'react-flip-move'

import {
  EuiFormRow,
  EuiFieldText,
  EuiFieldPassword,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
} from '@elastic/eui'

import { AsyncRequestState } from '../../../../types'

type FormErrors = {
  email?: ReactNode
  password?: ReactNode
}

export type Props = {
  email: string
  error: AsyncRequestState['error']
  onSave: (params: { newEmail: string; oldEmail: string; password: string }) => void
  onCancel: () => void
}

type State = {
  email: string
  password: string
  hasChangedEmail: boolean
  errors: FormErrors | undefined
}

class EmailForm extends Component<Props, State> {
  state: State = {
    email: this.props.email,
    password: ``,
    hasChangedEmail: false,
    errors: undefined,
  }

  static getDerivedStateFromProps(nextProps: Props): Partial<State> | null {
    if (nextProps.error) {
      const errors = makeApiErrors(nextProps.error)

      if (errors) {
        return { errors }
      }
    }

    return null
  }

  render() {
    const { onCancel } = this.props
    const { email, password, hasChangedEmail, errors = {} } = this.state

    const emailUnchanged = email === this.props.email

    const labels = {
      email: (
        <FormattedMessage
          id='uc.accountDetails.emailForm.emailLabel'
          defaultMessage='Email address'
        />
      ),
      password: (
        <FormattedMessage
          id='uc.accountDetails.emailForm.passwordLabel'
          defaultMessage='Current password'
        />
      ),
    }

    return (
      <div>
        <EuiFormRow
          id='emailForm-email'
          label={labels.email}
          isInvalid={Boolean(errors.email)}
          error={errors.email}
        >
          <EuiFieldText
            isInvalid={!!errors.email}
            value={email}
            onChange={(e) => this.setState({ email: e.target.value, hasChangedEmail: true })}
          />
        </EuiFormRow>

        <FlipMove duration={250} easing='ease' enterAnimation='elevator' leaveAnimation='none'>
          {hasChangedEmail && (
            <div key='onlychild'>
              <EuiSpacer />
              <EuiFormRow
                id='emailForm-password'
                label={labels.password}
                isInvalid={Boolean(errors.password)}
                error={errors.password}
              >
                <EuiFieldPassword
                  type='password'
                  isInvalid={!!errors.password}
                  value={password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
              </EuiFormRow>
              <div />
            </div>
          )}
        </FlipMove>

        <EuiSpacer />

        <EuiFlexGroup justifyContent='flexEnd'>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty size='s' onClick={onCancel}>
              <FormattedMessage
                id='uc.accountDetails.emailForm.cancelButton'
                defaultMessage='Cancel'
              />
            </EuiButtonEmpty>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiButton size='s' fill={true} disabled={emailUnchanged} onClick={this.save}>
              <FormattedMessage
                id='uc.accountDetails.emailForm.saveButton'
                defaultMessage='Update email'
              />
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    )
  }

  save = () => {
    const errors = makeClientErrors(this.state)

    if (errors) {
      this.setState({ errors })
      return
    }

    const { email: oldEmail, onSave } = this.props
    const { email: newEmail, password } = this.state

    onSave({
      oldEmail,
      newEmail,
      password,
    })
  }
}

export default EmailForm

function makeApiErrors(apiError: AsyncRequestState['error']): State['errors'] {
  const errors: FormErrors = {}

  if (get(apiError, [`response`, `status`]) === 403) {
    errors.password = (
      <FormattedMessage
        id='uc.accountDetails.emailForm.passwordError'
        defaultMessage='The password is incorrect'
      />
    )
  }

  if (get(apiError, [`response`, `status`]) === 409) {
    errors.email = (
      <FormattedMessage
        id='uc.accountDetails.emailForm.emailInUseError'
        defaultMessage='This email address is in use by another account'
      />
    )
  }

  const emailError = get(apiError, [`body`, `detail`, `new`])

  if (emailError) {
    errors.email = emailError
  }

  if (isEmpty(errors)) {
    return undefined
  }

  return errors
}

function makeClientErrors(state: State): State['errors'] {
  const errors: FormErrors = {}

  forEach([`email`, `password`], (fieldName) => {
    if (isEmpty(state[fieldName])) {
      errors[fieldName] = (
        <FormattedMessage
          id='uc.accountDetails.emailForm.requiredError'
          defaultMessage='Required'
        />
      )
    }
  })

  if (isEmpty(errors)) {
    return undefined
  }

  return errors
}
