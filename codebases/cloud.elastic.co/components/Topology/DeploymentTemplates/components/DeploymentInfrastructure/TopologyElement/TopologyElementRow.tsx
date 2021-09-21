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

import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui'

interface Props {
  label: ReactNode
  alignItems?: 'flexStart' | 'center'
  children: ReactNode
  labelColor?: 'subdued' | 'warning'
}

const TopologyElementRow: FunctionComponent<Props> = ({
  label,
  alignItems = 'flexStart',
  children,
  labelColor = 'subdued',
}) => (
  <EuiFlexGroup
    className='deploymentInfrastructure-topologyElement-row'
    gutterSize='l'
    alignItems={alignItems}
    responsive={false}
  >
    <EuiFlexItem grow={false}>
      <EuiText
        size='s'
        color={labelColor}
        className='deploymentInfrastructure-topologyElement-row-label'
      >
        {label}
      </EuiText>
    </EuiFlexItem>
    <EuiFlexItem grow={true}>{children}</EuiFlexItem>
  </EuiFlexGroup>
)

export default TopologyElementRow
