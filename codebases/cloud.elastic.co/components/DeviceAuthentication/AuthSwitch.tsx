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
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'
import { EuiLoadingSpinner, EuiSwitch } from '@elastic/eui'
import { AsyncRequestState } from '../../types'

interface Props extends WrappedComponentProps {
  disableMfaDeviceRequest: AsyncRequestState
  enableMfaDeviceRequest: AsyncRequestState
  mfaEnabled: boolean
  toggle: () => void
}

const messages = defineMessages({
  toggleMfa: {
    id: 'device-authentication.switch',
    defaultMessage: 'Toggle MFA authentication',
  },
})

const AuthSwitch: FunctionComponent<Props> = ({
  intl: { formatMessage },
  disableMfaDeviceRequest,
  enableMfaDeviceRequest,
  mfaEnabled,
  toggle,
}) => {
  const inProgress = disableMfaDeviceRequest.inProgress || enableMfaDeviceRequest.inProgress

  if (inProgress) {
    return <EuiLoadingSpinner size='m' />
  }

  return (
    <EuiSwitch
      checked={mfaEnabled}
      onChange={toggle}
      showLabel={false}
      label={formatMessage(messages.toggleMfa)}
    />
  )
}

export default injectIntl(AuthSwitch)
