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
import { FormattedMessage } from 'react-intl'
import { get } from 'lodash'

import StatPressureIndicator from '../../../StatPressureIndicator'

import toPercentage from '../../../../lib/toPercentage'

import { ClusterInstanceInfo } from '../../../../lib/api/v1/types'

type Props = {
  instance: ClusterInstanceInfo
  label?: JSX.Element
  isInteractive?: boolean
}

const DiskUsage: FunctionComponent<Props> = ({ label, instance, isInteractive = true }) => {
  const storageUsed = get(instance, [`disk`, `disk_space_used`], 0)
  const storageCapacity = get(instance, [`disk`, `disk_space_available`], 0)

  const fillPercentage = storageUsed / storageCapacity

  const usagePercent = toPercentage(Number.isNaN(fillPercentage) ? 0 : fillPercentage)

  const almostFull = isAlmostFull(usagePercent)

  const defaultLabel = (
    <FormattedMessage id='disk-usage-gauge.default-label' defaultMessage='Disk usage' />
  )

  return (
    <StatPressureIndicator
      label={label || defaultLabel}
      pressure={usagePercent}
      total={storageCapacity}
      isStressed={almostFull}
      isInteractive={isInteractive}
    />
  )
}

function isAlmostFull(usedPercentage: number) {
  return usedPercentage >= 75
}

export default DiskUsage
