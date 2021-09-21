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
import { EuiCode } from '@elastic/eui'
import { Difference } from '../../../../lib/stackDeployments/planDiffs/types'
import { DifferenceFormatter } from '../types'

export const systemPluginAddedFormatter: DifferenceFormatter = {
  handles: `system-plugin-added`,
  formatter: ({ difference }) => {
    const { target, meta } = difference as Difference<{ id: string }>
    const { id } = meta || {}
    return {
      id: `${target}-add-system-plugin-${id}`,
      type: target,
      message: (
        <FormattedMessage
          id='explain-changes.add-system-plugin'
          defaultMessage='Add {pluginId} plugin'
          values={{ pluginId: <EuiCode>{id}</EuiCode> }}
        />
      ),
    }
  },
}

export const systemPluginRemovedFormatter: DifferenceFormatter = {
  handles: `system-plugin-removed`,
  formatter: ({ difference }) => {
    const { target, meta } = difference as Difference<{ id: string }>
    const { id } = meta || {}
    return {
      id: `${target}-remove-system-plugin-${id}`,
      type: target,
      message: (
        <FormattedMessage
          id='explain-changes.remove-system-plugin'
          defaultMessage='Remove {pluginId} plugin'
          values={{ pluginId: <EuiCode>{id}</EuiCode> }}
        />
      ),
    }
  },
}
