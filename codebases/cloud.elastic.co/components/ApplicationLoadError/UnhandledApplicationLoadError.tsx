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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCallOut, EuiCodeBlock, EuiErrorBoundary, EuiSpacer } from '@elastic/eui'

import ApplicationLoadError from './ApplicationLoadError'

type Props = {
  error?: Error
}

const UnhandledApplicationLoadError: FunctionComponent<Props> = ({ error, children }) => (
  <ApplicationLoadError>
    <EuiCallOut
      color='danger'
      title={
        <FormattedMessage
          id='unhandled-application-load-error.loading-failed'
          defaultMessage='There was an error loading the application'
        />
      }
    />

    {children && (
      <Fragment>
        <EuiSpacer size='m' />
        {children}
      </Fragment>
    )}

    <EuiSpacer size='m' />

    {error && error.stack && (
      <EuiErrorBoundary>
        <EuiCodeBlock>{error.stack}</EuiCodeBlock>
      </EuiErrorBoundary>
    )}
  </ApplicationLoadError>
)

export default UnhandledApplicationLoadError
