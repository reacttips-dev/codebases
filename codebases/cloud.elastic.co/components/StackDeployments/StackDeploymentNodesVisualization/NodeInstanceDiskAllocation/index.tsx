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
import { FormattedMessage } from 'react-intl'
import { get } from 'lodash'

import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui'

import NodeInstanceStatsDisplay, { getUsagePercent } from '../NodeInstanceStatsDisplay'

import prettySize from '../../../../lib/prettySize'
import { ClusterInstanceInfo } from '../../../../lib/api/v1/types'

import './nodeInstanceDiskAllocation.scss'

interface Props {
  instance: ClusterInstanceInfo
}

const NodeInstanceDiskAllocation: FunctionComponent<Props> = ({ instance }) => {
  const diskAllocation = getDiskAllocation(instance)

  return (
    <NodeInstanceStatsDisplay
      {...diskAllocation}
      title={
        <FormattedMessage id='node-instance-disk-allocation' defaultMessage='Disk allocation' />
      }
    />
  )
}

const getDiskAllocation = (instance) => {
  const { disk } = instance
  const diskSpaceAvailable = get(disk, [`disk_space_available`], 0)
  const diskSpaceUsed = get(disk, [`disk_space_used`], 0)
  const diskSpaceUsedDisplay = diskSpaceUsed ? prettySize(diskSpaceUsed) : `0 GB`
  const usagePercent = getUsagePercent(diskSpaceUsed, diskSpaceAvailable)

  const stressed = isAlmostFull(usagePercent)

  const diskAllocation: {
    status: ReactChild
    used: number
    available: number
    stressed: boolean
    usagePercent: number
  } = {
    status: '',
    used: diskSpaceUsed,
    available: 0,
    stressed,
    usagePercent: Math.round(usagePercent),
  }

  diskAllocation.available = diskSpaceAvailable
  diskAllocation.status = (
    <EuiFlexGroup
      alignItems='center'
      gutterSize='xs'
      responsive={false}
      className='node-instance-disk-allocation'
    >
      <EuiFlexItem grow={false}>
        <EuiText
          color={stressed ? 'danger' : 'default'}
          size='s'
          data-test-id='node-instance-disk-allocation-used'
          className='node-instance-disk-allocation-text'
        >
          {diskSpaceUsedDisplay}
        </EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>/</EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiText
          size='s'
          data-test-id='node-instance-disk-allocation-available'
          className='node-instance-disk-allocation-text'
        >
          {diskSpaceAvailable ? prettySize(diskSpaceAvailable) : `0 GB`}
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  return diskAllocation
}

const isAlmostFull = (usedPercentage: number) => usedPercentage >= 75

export default NodeInstanceDiskAllocation
