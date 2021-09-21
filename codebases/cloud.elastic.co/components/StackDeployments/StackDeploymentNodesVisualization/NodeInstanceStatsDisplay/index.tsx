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

import React, { FunctionComponent, ReactChild } from 'react'
import { EuiFlexGroup, EuiFlexItem, EuiProgress, EuiText } from '@elastic/eui'
import Percentage from '../../../../lib/Percentage'
import toPercentage from '../../../../lib/toPercentage'

import './nodeInstanceStatsDisplay.scss'

interface Props {
  available: number
  status: ReactChild
  stressed: boolean
  title: ReactChild
  used: number
  usagePercent?: number
}

const NodeInstanceStatsDisplay: FunctionComponent<Props> = ({
  available,
  status,
  stressed,
  title,
  used,
  usagePercent,
}) => {
  const color = stressed ? `danger` : `subdued`

  return (
    <EuiFlexGroup
      alignItems='center'
      gutterSize='m'
      responsive={false}
      className='node-instance-stats-display'
    >
      <EuiFlexItem className='node-instance-stats-display-title-column'>
        <EuiFlexGroup>
          <EuiFlexItem style={{ width: '135px' }}>
            <EuiText size='xs' color='subdued' data-test-id='instance-stats-display-title'>
              {title}
            </EuiText>
            {status}
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiProgress
          value={used}
          max={available}
          color={color}
          data-test-id='instance-stats-display-progress'
        />
      </EuiFlexItem>
      <EuiFlexItem
        className='node-instance-stats-display-value-column'
        style={{ maxWidth: '35px' }}
      >
        <EuiText size='s' color='default' data-test-id='instance-stats-display-percentage'>
          <Percentage
            value={
              typeof usagePercent === 'undefined'
                ? getUsagePercent(used, available) / 100
                : usagePercent / 100
            }
          />
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

export const getUsagePercent = (used, available) => {
  const usage = used / available

  if (!Number.isNaN(usage)) {
    return toPercentage(usage)
  }

  return 0
}

export default NodeInstanceStatsDisplay
