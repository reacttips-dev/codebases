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
import { defineMessages, injectIntl, IntlShape } from 'react-intl'

import { EuiHealth } from '@elastic/eui'

import { Allocator, AllocatorSearchResult } from '../types'

type Props = {
  intl: IntlShape
  allocator: Allocator | AllocatorSearchResult
}

const messages = defineMessages({
  disconnected: {
    id: `allocator-health.disconnected`,
    defaultMessage: `Disconnected`,
  },
  maintenance: {
    id: `allocator-health.maintenance`,
    defaultMessage: `Maintenance`,
  },
  unhealthy: {
    id: `allocator-health.unhealthy`,
    defaultMessage: `Unhealthy`,
  },
  healthy: {
    id: `allocator-health.healthy`,
    defaultMessage: `Healthy`,
  },
})

const AllocatorHealth: FunctionComponent<Props> = ({
  intl: { formatMessage },
  allocator: { isInMaintenanceMode, healthy, connected },
}) => {
  if (!connected) {
    return <EuiHealth color='warning'>{formatMessage(messages.disconnected)}</EuiHealth>
  }

  if (!healthy) {
    return <EuiHealth color='danger'>{formatMessage(messages.unhealthy)}</EuiHealth>
  }

  if (isInMaintenanceMode) {
    return <EuiHealth color='warning'>{formatMessage(messages.maintenance)}</EuiHealth>
  }

  return <EuiHealth color='secondary'>{formatMessage(messages.healthy)}</EuiHealth>
}

export default injectIntl(AllocatorHealth)
