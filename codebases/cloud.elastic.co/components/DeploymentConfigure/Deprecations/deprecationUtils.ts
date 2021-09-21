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

import { isEmpty } from 'lodash'

import { AlertType } from '../../../cui'
import { Deprecation, DeprecationsByIndex, DeprecationsResponse } from '../../../types'

export type DeprecationCounts = {
  critical: number
  warning: number
  info: number
  none: number
  handled: number
}

/**
 * List of known settings that even if they are critical will be handled by the allocator. Not all of
 * these have been observed to be critical.
 * Compare to scala-services/constructor/src/main/scala/no/found/constructor/steps/upgradecheck/toV6
 */
const whitelist = [
  `non-existence`,

  // the script settings that will be handled during plan migration (found in nodeSettings)
  `Deprecated script security settings changes`,
  `S3 Repository settings changed`,
]

export function hasAnyCriticalMessages(deprecations: DeprecationsResponse) {
  const isUnhandledCritical = (deprecation: Deprecation) =>
    deprecation.level === `critical` && !whitelist.includes(deprecation.message)

  return Object.keys(deprecations).some((deprecationArea) => {
    if (Array.isArray(deprecations[deprecationArea])) {
      return (deprecations[deprecationArea] as Deprecation[]).some(isUnhandledCritical)
    }

    const deprecationsByIndex = deprecations[deprecationArea] as DeprecationsByIndex
    return Object.keys(deprecationsByIndex).some((index) =>
      deprecationsByIndex[index].some(isUnhandledCritical),
    )
  })
}

export function countByLevel(deprecations: DeprecationsResponse): DeprecationCounts {
  const byLevel = {
    critical: 0,
    warning: 0,
    info: 0,
    none: 0,
    handled: 0,
  }

  const incrementCount = (deprecation) => {
    const level = whitelist.includes(deprecation.message) ? `handled` : deprecation.level
    byLevel[level]++
  }

  for (const deprecationArea of Object.keys(deprecations)) {
    if (Array.isArray(deprecations[deprecationArea])) {
      for (const deprecation of deprecations[deprecationArea] as Deprecation[]) {
        incrementCount(deprecation)
      }
    } else {
      const deprecationsByIndex = deprecations[deprecationArea] as DeprecationsByIndex

      for (const index of Object.keys(deprecationsByIndex)) {
        for (const deprecation of deprecationsByIndex[index]) {
          incrementCount(deprecation)
        }
      }
    }
  }

  return byLevel
}

export function getDeprecationLevel(deprecations: DeprecationsResponse | undefined): AlertType {
  if (deprecations == null || isEmpty(deprecations)) {
    return `info`
  }

  const totalsByLevel = countByLevel(deprecations)

  if (totalsByLevel.critical > 0) {
    return `error`
  }

  if (totalsByLevel.warning > 0) {
    return `warning`
  }

  return `info`
}
