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

import React, { FunctionComponent } from 'react'
import { EuiCallOut } from '@elastic/eui'
import { FormattedMessage } from 'react-intl'

type Props = {
  email: string
}

const VerifyEmailSuccess: FunctionComponent<Props> = ({ email }) => {
  const successMessage = (
    <FormattedMessage
      id='verify-email.success'
      defaultMessage='A new verification email was sent to {email}. Click the link to complete your registration.'
      values={{
        email: email || null,
      }}
    />
  )

  return (
    <EuiCallOut
      className='verifyEmailSuccess'
      size='s'
      color='success'
      iconType='check'
      title={successMessage}
    />
  )
}

export default VerifyEmailSuccess
