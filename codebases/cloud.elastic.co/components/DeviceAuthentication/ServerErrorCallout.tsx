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
import { EuiCallOut } from '@elastic/eui'

const ServerErrorCallout = () => (
  <EuiCallOut
    title={
      <FormattedMessage
        id='device-authentication.server-unexpected-error-title'
        defaultMessage='Something went wrong'
      />
    }
    color='danger'
    iconType='alert'
  >
    <FormattedMessage
      id='device-authentication.server-unexpected-error'
      defaultMessage='The server encountered an internal error and was not able to complete your request. Try again later'
    />
  </EuiCallOut>
)

export default ServerErrorCallout
