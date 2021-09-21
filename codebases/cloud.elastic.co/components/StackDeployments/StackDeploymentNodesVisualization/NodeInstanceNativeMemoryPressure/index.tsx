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

import { EuiText } from '@elastic/eui'
import { ClusterInstanceInfo } from '../../../../lib/api/v1/types'
import NodeInstanceStatsDisplay from '../NodeInstanceStatsDisplay'

interface Props {
  instance: ClusterInstanceInfo
}

const NodeInstanceNativeMemoryPressure: FunctionComponent<Props> = ({ instance }) => {
  const memoryPressure = get(instance, [`memory`, `native_memory_pressure`], 0)
  const memoryCapacity = get(instance, [`memory`, `instance_capacity`], 0)
  const stressed = isUnderPressure(memoryPressure)

  return (
    <NodeInstanceStatsDisplay
      available={memoryCapacity}
      stressed={stressed}
      status={
        stressed ? (
          <EuiText color='danger' size='s' data-test-id='native-memory-pressure-high'>
            <FormattedMessage id='native-memory-pressure.high' defaultMessage='High' />
          </EuiText>
        ) : (
          <EuiText size='s' data-test-id='native-memory-pressure-normal'>
            <FormattedMessage id='native-memory-pressure.normal' defaultMessage='Normal' />
          </EuiText>
        )
      }
      used={memoryPressure}
      title={
        <FormattedMessage
          id='native-memory-pressure.default-label'
          defaultMessage='Native memory pressure'
        />
      }
    />
  )
}

const isUnderPressure = (memoryPressure: number) => memoryPressure >= 80

export default NodeInstanceNativeMemoryPressure
