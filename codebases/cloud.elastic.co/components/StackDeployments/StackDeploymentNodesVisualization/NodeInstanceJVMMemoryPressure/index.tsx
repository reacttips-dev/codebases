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
import { clamp, get } from 'lodash'

import { EuiText } from '@elastic/eui'

import NodeInstanceStatsDisplay from '../NodeInstanceStatsDisplay'

import { ClusterInstanceInfo } from '../../../../lib/api/v1/types'

interface Props {
  instance: ClusterInstanceInfo
}

const NodeInstanceJVMMemoryPressure: FunctionComponent<Props> = ({ instance }) => {
  const memoryPressure = getMemoryPressure(instance)
  const stressed = isUnderPressure(memoryPressure)

  return (
    <NodeInstanceStatsDisplay
      available={100}
      stressed={stressed}
      status={
        stressed ? (
          <EuiText color='danger' size='s' data-test-id='jvm-memory-pressure-high'>
            <FormattedMessage id='jvm-memory-pressure.high' defaultMessage='High' />
          </EuiText>
        ) : (
          <EuiText size='s' data-test-id='jvm-memory-pressure-normal'>
            <FormattedMessage id='jvm-memory-pressure.normal' defaultMessage='Normal' />
          </EuiText>
        )
      }
      used={memoryPressure}
      title={
        <FormattedMessage
          id='jvm-memory-pressure.default-label'
          defaultMessage='JVM memory pressure'
        />
      }
    />
  )
}

const getMemoryPressure = (instance) => {
  const memoryPressure = get(instance, [`memory`, `memory_pressure`], 0)

  if (memoryPressure == null) {
    return memoryPressure
  }

  return clamp(memoryPressure, 0, 100)
}

const isUnderPressure = (memoryPressure: number) => memoryPressure >= 75

export default NodeInstanceJVMMemoryPressure
