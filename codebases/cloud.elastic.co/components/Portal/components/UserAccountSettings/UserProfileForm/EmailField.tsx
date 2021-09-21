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
import {
  EuiCallOut,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiScreenReaderOnly,
  EuiSpacer,
} from '@elastic/eui'
import FieldEditButton from '../../../../FieldEditButton'
import { addToast } from '../../../../../cui/Toasts'

export interface Props extends WrappedComponentProps {
  editing: boolean
  disabled?: boolean
  emailDidChange?: boolean
  emailUpdateRequested?: boolean
  error?: React.ReactChild
  isInvalid: boolean
  onChange: (e: any) => void
  onClickEdit: () => void
  newEmail?: string
  value: string
}

const messages = defineMessages({
  email: {
    id: 'user-settings-profile.email-address',
    defaultMessage: 'Email address',
  },
  newEmail: {
    id: 'user-settings-profile.new-email-address',
    defaultMessage: 'New email address',
  },
  editButton: {
    id: 'user-settings-profile.edit-email-address',
    defaultMessage: 'Edit',
  },
  editButtonScreenReader: {
    id: 'user-settings-profile.edit-email-address-screen-reader',
    defaultMessage: 'Email Address',
  },
})

const toastText = {
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

class EmailField extends PureComponent<Props> {
  render() {
    const { editing, disabled, error, isInvalid, intl, onChange, onClickEdit, value } = this.props
    const { formatMessage } = intl

    return (
      <Fragment>
        <EuiFormRow
          label={editing ? formatMessage(messages.newEmail) : formatMessage(messages.email)}
          error={error}
          isInvalid={isInvalid}
        >
          <EuiFlexGroup responsive={true} gutterSize='none' alignItems='center'>
            <EuiFlexItem>
              <EuiFieldText
                aria-label='Email'
                data-test-id='update-profile-change-email'
                isInvalid={isInvalid}
                name='email'
                disabled={!editing || disabled}
                onChange={onChange}
                value={value}
                placeholder={
                  editing ? formatMessage(messages.newEmail) : formatMessage(messages.email)
                }
              />
            </EuiFlexItem>
            {!editing && !disabled && (
              <EuiFlexItem grow={false} className='user-settings-profile-edit-button'>
                <FieldEditButton onClick={onClickEdit}>
                  <div>
                    {formatMessage(messages.editButton)}
                    <EuiScreenReaderOnly>
                      <div>{formatMessage(messages.editButtonScreenReader)}</div>
                    </EuiScreenReaderOnly>
                  </div>
                </FieldEditButton>
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </EuiFormRow>
        {this.renderEmailUpdateCallout()}
      </Fragment>
    )
  }

  renderEmailUpdateCallout() {
    const { emailUpdateRequested, emailDidChange, newEmail } = this.props

    if (emailUpdateRequested) {
      return (
        <Fragment>
          <EuiSpacer size='m' />
          <EuiCallOut
            title={
              <FormattedMessage
                id='update-profile.confirm-email-change-notice-title'
                defaultMessage='Validate your new email address'
              />
            }
          >
            <FormattedMessage
              id='update-profile.confirm-email-change-notice'
              defaultMessage='We sent you a confirmation link to {newEmail}. Click it to update your email. This will replace your current credentials with the new email address'
              values={{
                newEmail: <strong>{newEmail}</strong>,
              }}
            />
          </EuiCallOut>
        </Fragment>
      )
    }

    if (emailDidChange) {
      addToast({
        ...toastText.emailDidChange,
      })
    }

    return null
  }
}

export default injectIntl(EmailField)
