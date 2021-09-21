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
import { Link } from 'react-router-dom'

import { supportUrl } from '../../../../../lib/urlBuilder'

type Props = {
  error?: any
}

const VerifyEmailError: FunctionComponent<Props> = ({ error }) => {
  const errorMessage = (
    <FormattedMessage
      id='verify-email.error'
      defaultMessage='{error}. Please {contactSupport}.'
      values={{
        error: error || (
          <FormattedMessage
            data-test-id='verify-email.error.standard-message'
            id='verify-email.error.standard-message'
            defaultMessage='Something went wrong sending the verification email'
          />
        ),
        contactSupport: (
          <Link to={supportUrl()}>
            <FormattedMessage
              id='verify-email.error.contact-support'
              defaultMessage='contact support'
            />
          </Link>
        ),
      }}
    />
  )

  return <EuiCallOut className='verifyEmailError' size='s' color='danger' title={errorMessage} />
}

export default VerifyEmailError
