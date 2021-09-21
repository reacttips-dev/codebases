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
import { AnyTopologyElement } from '../../types'
import { InstanceConfiguration } from '../api/v1/types'
import { isData } from './selectors'
import { diffPlan } from './planDiffs'
import { diffTopology } from './planDiffs/topology'
import { Difference, DifferenceArgs } from './planDiffs/types'

export function hasDisabledDataTier(args: Omit<DifferenceArgs, 'sliderInstanceType'>): boolean {
  const topologyDifferences = diffPlan(
    {
      ...args,
      sliderInstanceType: `elasticsearch`,
    },
    [diffTopology],
  )
  const disabledDataTierInDiff = topologyDifferences
    .filter((d) => d.type === `topology-element-disabled`)
    .some((d) => {
      const { meta } = d as Difference<{
        instanceConfiguration: InstanceConfiguration | null
        topologyElement: AnyTopologyElement
      }>
      return isData({ topologyElement: meta!.topologyElement })
    })

  return disabledDataTierInDiff
}
