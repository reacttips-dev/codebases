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

import {
  EuiFormRow,
  EuiFieldPassword,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
} from '@elastic/eui'

import { AsyncRequestState } from '../../../../types'

export type Props = {
  error: AsyncRequestState['error']
  onSave: (params: { oldPassword: string; newPassword: string }) => void
  onCancel: () => void
}

type FormErrors = {
  oldPassword?: ReactNode
  newPasswordInput?: ReactNode
  newPasswordRepeat?: ReactNode
}

type State = {
  oldPassword: string
  newPasswordInput: string
  newPasswordRepeat: string
  errors: FormErrors | undefined
}

class PasswordForm extends Component<Props, State> {
  state: State = {
    oldPassword: ``,
    newPasswordInput: ``,
    newPasswordRepeat: ``,
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
    const { oldPassword, newPasswordInput, newPasswordRepeat, errors = {} } = this.state

    const labels = {
      oldPassword: (
        <FormattedMessage
          id='uc.accountDetails.passwordForm.oldPasswordLabel'
          defaultMessage='Current password'
        />
      ),
      newPasswordInput: (
        <FormattedMessage
          id='uc.accountDetails.passwordForm.newPasswordInputLabel'
          defaultMessage='New password'
        />
      ),
      newPasswordRepeat: (
        <FormattedMessage
          id='uc.accountDetails.passwordForm.newPassword2Label'
          defaultMessage='Confirm new password'
        />
      ),
    }

    return (
      <div>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFormRow
              id='passwordForm-oldPassword'
              label={labels.oldPassword}
              isInvalid={Boolean(errors.oldPassword)}
              error={errors.oldPassword}
            >
              <EuiFieldPassword
                type='password'
                isInvalid={Boolean(errors.oldPassword)}
                value={oldPassword}
                onChange={(e) => this.setState({ oldPassword: e.target.value })}
              />
            </EuiFormRow>
          </EuiFlexItem>

          <EuiFlexItem />
        </EuiFlexGroup>

        <EuiSpacer />

        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFormRow
              id='passwordForm-newPasswordInput'
              label={labels.newPasswordInput}
              isInvalid={Boolean(errors.newPasswordInput)}
              error={errors.newPasswordInput}
            >
              <EuiFieldPassword
                type='password'
                isInvalid={Boolean(errors.newPasswordInput)}
                value={newPasswordInput}
                onChange={(e) => this.setState({ newPasswordInput: e.target.value })}
              />
            </EuiFormRow>
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiFormRow
              id='passwordForm-newPasswordRepeat'
              label={labels.newPasswordRepeat}
              isInvalid={Boolean(errors.newPasswordRepeat)}
              error={errors.newPasswordRepeat}
            >
              <EuiFieldPassword
                type='password'
                isInvalid={Boolean(errors.newPasswordRepeat)}
                value={newPasswordRepeat}
                onChange={(e) => this.setState({ newPasswordRepeat: e.target.value })}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer />

        <EuiFlexGroup justifyContent='flexEnd'>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty size='s' onClick={onCancel}>
              <FormattedMessage
                id='uc.accountDetails.passwordForm.cancelButton'
                defaultMessage='Cancel'
              />
            </EuiButtonEmpty>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiButton size='s' fill={true} onClick={this.save}>
              <FormattedMessage
                id='uc.accountDetails.passwordForm.saveButton'
                defaultMessage='Update password'
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

    const { onSave } = this.props
    const { oldPassword, newPasswordInput } = this.state

    onSave({
      oldPassword,
      newPassword: newPasswordInput,
    })
  }
}

export default PasswordForm

function makeApiErrors(apiError: AsyncRequestState['error']): State['errors'] {
  const errors: FormErrors = {}

  if (get(apiError, [`response`, `status`]) === 403) {
    errors.oldPassword = (
      <FormattedMessage
        id='uc.accountDetails.passwordForm.oldPasswordError'
        defaultMessage='The password is incorrect'
      />
    )
  }

  if (isEmpty(errors)) {
    return undefined
  }

  return errors
}

function makeClientErrors(state: State): State['errors'] {
  const errors: FormErrors = {}

  forEach([`oldPassword`, `newPasswordInput`, `newPasswordRepeat`], (fieldName) => {
    if (isEmpty(state[fieldName])) {
      errors[fieldName] = (
        <FormattedMessage
          id='uc.accountDetails.passwordForm.requiredError'
          defaultMessage='Required'
        />
      )
    }
  })

  if (!errors.newPasswordInput && !errors.newPasswordRepeat) {
    if (state.newPasswordInput !== state.newPasswordRepeat) {
      errors.newPasswordRepeat = (
        <FormattedMessage
          id='uc.accountDetails.passwordForm.mismatchedPasswordsError'
          defaultMessage='New passwords must match'
        />
      )
    }
  }

  if (isEmpty(errors)) {
    return undefined
  }

  return errors
}
