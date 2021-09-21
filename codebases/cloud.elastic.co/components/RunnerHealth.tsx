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

import { EuiHealth } from '@elastic/eui'

import { Runner } from '../types'

const messages = defineMessages({
  disconnected: {
    id: `runner-health.disconnected`,
    defaultMessage: `Disconnected`,
  },
  unhealthy: {
    id: `runner-health.unhealthy`,
    defaultMessage: `Unhealthy`,
  },
  healthy: {
    id: `runner-health.healthy`,
    defaultMessage: `Healthy`,
  },
})

interface Props extends WrappedComponentProps {
  runner: Runner
}

const RunnerHealth: FunctionComponent<Props> = ({
  intl: { formatMessage },
  runner: { healthy, connected },
}) => {
  if (!connected) {
    return <EuiHealth color='warning'>{formatMessage(messages.disconnected)}</EuiHealth>
  }

  if (!healthy) {
    return <EuiHealth color='danger'>{formatMessage(messages.unhealthy)}</EuiHealth>
  }

  return <EuiHealth color='secondary'>{formatMessage(messages.healthy)}</EuiHealth>
}

export default injectIntl(RunnerHealth)
