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

import { union, difference } from 'lodash'

import SearchAllocators from './SearchAllocators'

type Props = {
  regionId: string
  allocatorId: string
  targets: string[]
  setTargets: (targets: string[]) => void
}

const VacateTargets: FunctionComponent<Props> = ({
  regionId,
  allocatorId,
  targets,
  setTargets,
}) => (
  <SearchAllocators
    placeholder='Preferred allocators'
    regionId={regionId}
    allocatorId={allocatorId}
    selectedAllocatorIds={targets}
    selectAllocatorId={(allocatorId) => setTargets(union(targets, [allocatorId]))}
    unselectAllocatorId={(allocatorId) => setTargets(difference(targets, [allocatorId]))}
  />
)

export default VacateTargets
