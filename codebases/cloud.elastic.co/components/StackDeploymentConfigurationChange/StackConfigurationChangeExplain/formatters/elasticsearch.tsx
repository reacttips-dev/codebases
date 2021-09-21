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

import { DifferenceFormatter } from '../types'
import IndexCurationDestinationChanges from '../ExplainChanges/IndexCurationDestinationChanges'
import IndexCurationSourceChanges from '../ExplainChanges/IndexCurationSourceChanges'
import { Difference } from '../../../../lib/stackDeployments/planDiffs/types'

export const esCurationSourceFormatter: DifferenceFormatter = {
  formatter: ({ difference }) => {
    const { type, target, meta } = difference as Difference<{
      current: string
      next: string
    }>
    return {
      id: type,
      type: target,
      message: <IndexCurationSourceChanges oldSource={meta?.current} currentSource={meta?.next} />,
    }
  },
  handles: `es-curation-source`,
}

export const esCurationDestFormatter: DifferenceFormatter = {
  formatter: ({ difference }) => {
    const { type, target, meta } = difference as Difference<{
      current: string
      next: string
    }>
    return {
      id: type,
      type: target,
      message: (
        <IndexCurationDestinationChanges
          oldDestination={meta?.current}
          currentDestination={meta?.next}
        />
      ),
    }
  },
  handles: `es-curation-dest`,
}
