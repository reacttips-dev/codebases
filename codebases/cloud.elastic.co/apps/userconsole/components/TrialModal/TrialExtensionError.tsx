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

import { EuiButtonEmpty, EuiCallOut } from '@elastic/eui'

import { CuiAlert } from '../../../../cui/Alert'
import { ApiError } from '../../../../cui/Alert/errorParsing'

const TrialExtensionError = ({ extendTrial, extendTrialRequest }) => {
  const error = extendTrialRequest.error as Error & ApiError

  if (error.body && (error.body.error || error.body.errors)) {
    return (
      <CuiAlert
        data-test-id='trial-extention-error.api-error'
        size='s'
        type='danger'
        iconType='alert'
      >
        {extendTrialRequest.error}
      </CuiAlert>
    )
  }

  return (
    <EuiCallOut
      data-test-id='trial-extention-error.generic-error'
      size='s'
      color='danger'
      iconType='alert'
      title={
        <FormattedMessage
          id='request-trial-extension.error'
          defaultMessage='Something went wrong while requesting an extension of your trial. {tryAgain}'
          values={{
            tryAgain: (
              <EuiButtonEmpty
                size='xs'
                onClick={extendTrial}
                className='request-trial-extension.button'
              >
                <FormattedMessage
                  id='request-trial-extension.error.retry-request'
                  defaultMessage='Try again'
                />
              </EuiButtonEmpty>
            ),
          }}
        />
      }
    />
  )
}

export default TrialExtensionError
