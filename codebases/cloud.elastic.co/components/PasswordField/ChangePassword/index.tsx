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

import React, { FunctionComponent, Fragment } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'
import PasswordField from '../'

interface Props extends WrappedComponentProps {
  isInvalidCurrentPassword?: boolean
  invalidCurrentPasswordError?: React.ReactChild
  onChange: (input: HTMLInputElement, { isValidPassword }: { isValidPassword: boolean }) => void
}

const messages = defineMessages({
  oldPassword: {
    id: 'change-password.oldPassword',
    defaultMessage: 'Current password',
  },
  newPassword: {
    id: 'change-password.newPassword',
    defaultMessage: 'New password',
  },
})

const ChangePassword: FunctionComponent<Props> = ({
  intl,
  invalidCurrentPasswordError,
  onChange,
}) => {
  const { formatMessage } = intl

  return (
    <Fragment>
      <PasswordField
        data-test-id='change-password-old'
        name='oldPassword'
        label={formatMessage(messages.oldPassword)}
        onChange={onChange}
        isInvalid={!!invalidCurrentPasswordError}
        error={invalidCurrentPasswordError}
      />
      <PasswordField
        data-test-id='change-password-new'
        name='newPassword'
        label={formatMessage(messages.newPassword)}
        onChange={onChange}
        hasStrengthIndicator={true}
      />
    </Fragment>
  )
}

export default injectIntl(ChangePassword)
