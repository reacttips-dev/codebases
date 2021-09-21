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

import React from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCallOut, EuiSpacer } from '@elastic/eui'
import { AccountUI, AsyncRequestState } from '../../../../types'

export default function Outcome({
  ui: { newEmail, emailDidChange },
  updateAccountPasswordRequest,
}: {
  ui: AccountUI
  updateAccountPasswordRequest: AsyncRequestState
}) {
  let title

  if (newEmail && !emailDidChange) {
    title = (
      <FormattedMessage
        id='uc.accountDetails.emailChangePendingNotification'
        defaultMessage='You must confirm your change to complete it. Check your { newEmail } email and click the confirmation link that we sent you.'
        values={{
          newEmail: <strong>{newEmail}</strong>,
        }}
      />
    )
  }

  if (emailDidChange) {
    title = (
      <FormattedMessage
        id='uc.accountDetails.emailChangedNotification'
        defaultMessage='Email change confirmed'
      />
    )
  }

  if (updateAccountPasswordRequest.isDone) {
    title = (
      <FormattedMessage
        id='uc.accountDetails.passwordChangedNotification'
        defaultMessage='Password changed'
      />
    )
  }

  if (title == null) {
    return null
  }

  return (
    <div>
      <EuiCallOut color='success' title={title} />
      <EuiSpacer size='s' />
    </div>
  )
}
