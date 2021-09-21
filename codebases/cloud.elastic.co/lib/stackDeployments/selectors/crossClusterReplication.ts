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

import { getFirstEsClusterFromGet, getVersion } from './fundamentals'

import { StackDeployment } from '../../../types'
import { gte, satisfies } from '../../semver'

export type TrustLevel = 'all' | 'none' | 'specific'

export const trustLevels: TrustLevel[] = [`all`, `none`, `specific`]

export function hasCrossClusterReplicationEnabled({
  deployment,
}: {
  deployment: StackDeployment
}): boolean {
  const esResource = getFirstEsClusterFromGet({ deployment })
  return Boolean(esResource?.info.metadata.ccr)
}

export function isCrossClusterReplicationEligible({
  deployment,
}: {
  deployment: StackDeployment
}): boolean {
  const version = getVersion({ deployment })

  if (version == null) {
    return false // sanity
  }

  // CCR is supported by the stack since 6.5.0, however, due to some bugs that would provide a poor experience in cloud
  // (e.g. elasticsearch#52347, elasticsearch#55314) we will only support it from 6.8.9 and 7.7.1. See #68474
  return satisfies(version, `>=6.8.9 <7`) || gte(version, `7.7.1`)
}
