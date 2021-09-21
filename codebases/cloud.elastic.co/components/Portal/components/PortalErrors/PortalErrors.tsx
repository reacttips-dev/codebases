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

import { EuiCallOut, EuiPanel, EuiSpacer } from '@elastic/eui'

import { describeSsoError } from '../../../../lib/ssoErrors'

type Props = {
  ssoErrorCode: string | null
  spacerBefore?: boolean
  spacerAfter?: boolean
}

const PortalErrors: FunctionComponent<Props> = ({ ssoErrorCode, spacerBefore, spacerAfter }) => {
  if (!ssoErrorCode) {
    return null
  }

  const ssoError = describeSsoError(ssoErrorCode)

  return (
    <Fragment>
      {spacerBefore && <EuiSpacer size='m' />}

      <EuiPanel hasShadow={true}>
        <EuiCallOut title={<FormattedMessage {...ssoError.title} />} color='warning'>
          <FormattedMessage {...ssoError.description} />
        </EuiCallOut>
      </EuiPanel>

      {spacerAfter && <EuiSpacer size='m' />}
    </Fragment>
  )
}

export default PortalErrors
