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
import { get, clamp } from 'lodash'

import StatPressureIndicator from '../../../StatPressureIndicator'

import { ClusterInstanceInfo } from '../../../../lib/api/v1/types'

type Props = {
  instance: ClusterInstanceInfo
  label?: JSX.Element
  ratio?: number
  isInteractive?: boolean
}

const JvmMemoryPressure: FunctionComponent<Props> = ({
  instance,
  label,
  ratio = 1,
  isInteractive = true,
}) => {
  const memoryPressure = getMemoryPressure({ instance, ratio })
  const memoryCapacity = get(instance, [`memory`, `instance_capacity`], 0)
  const stressed = isUnderPressure(memoryPressure)

  const defaultLabel = (
    <FormattedMessage id='jvm-memory-pressure.default-label' defaultMessage='JVM memory pressure' />
  )

  return (
    <StatPressureIndicator
      label={label || defaultLabel}
      pressure={memoryPressure}
      total={memoryCapacity}
      hideTotal={true}
      isStressed={stressed}
      isInteractive={isInteractive}
    />
  )
}

function getMemoryPressure({
  instance,
  ratio,
}: {
  instance: ClusterInstanceInfo
  ratio: number
}): number {
  const memoryPressure = get(instance, [`memory`, `memory_pressure`], 0)

  if (memoryPressure == null) {
    return memoryPressure
  }

  const bounded = clamp(memoryPressure / ratio, 0, 100)

  return bounded
}

function isUnderPressure(memoryPressure: number) {
  return memoryPressure >= 75
}

export default JvmMemoryPressure
