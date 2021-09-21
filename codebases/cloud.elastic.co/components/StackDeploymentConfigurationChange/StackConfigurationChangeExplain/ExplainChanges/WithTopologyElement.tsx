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

import React, { ReactElement } from 'react'

import { EuiBadge, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import { AnyTopologyElement } from '../../../../types'
import { InstanceConfiguration } from '../../../../lib/api/v1/types'

export default function WithTopologyElement({
  children,
  topologyElement,
  instanceConfiguration,
}: {
  children: ReactElement<any>
  topologyElement: AnyTopologyElement | undefined
  instanceConfiguration: InstanceConfiguration
}): JSX.Element | null {
  if (!instanceConfiguration) {
    return children
  }

  const badge = topologyElement?.id || instanceConfiguration.name

  return (
    <EuiFlexGroup gutterSize='s' alignItems='baseline' responsive={false}>
      <EuiFlexItem grow={false}>
        <span>{children}</span>
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiBadge color='hollow'>{badge}</EuiBadge>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}
