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

import React, { FunctionComponent, ReactNode } from 'react'

import { EuiBadge, EuiFlexGroup, EuiFlexItem, EuiIcon, IconType } from '@elastic/eui'

import StatusBadge from '../Status'

type Props = {
  iconType?: IconType
  name: ReactNode
  isDeleted?: boolean
  count: number | null
}

const DeploymentActivityTabTitle: FunctionComponent<Props> = ({
  iconType,
  name,
  isDeleted,
  count,
}) => {
  return (
    <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
      {iconType && (
        <EuiFlexItem grow={false}>
          <EuiIcon type={iconType} />
        </EuiFlexItem>
      )}

      <EuiFlexItem grow={false}>{name}</EuiFlexItem>

      {getBadge()}
    </EuiFlexGroup>
  )

  function getBadge() {
    if (isDeleted) {
      return (
        <EuiFlexItem grow={false}>
          <StatusBadge status='stopped' />
        </EuiFlexItem>
      )
    }

    if (typeof count === `number`) {
      return (
        <EuiFlexItem grow={false}>
          <EuiBadge color='hollow'>{count}</EuiBadge>
        </EuiFlexItem>
      )
    }

    return null
  }
}

export default DeploymentActivityTabTitle
