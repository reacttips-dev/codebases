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

import { get } from 'lodash'
import { LoggingPlanConfiguration, MetricsPlanConfiguration } from 'public/lib/api/v1/types'
import { AnyPlan } from '../../../types'
import { hasChangedPath, hasCurrent, hasNext } from './preconditions'
import { Difference, DifferenceCheck } from './types'

type ObservabilityType = `metrics` | `log`

interface ObservabilityDifferenceMeta {
  type: ObservabilityType
  currentDestination?:
    | LoggingPlanConfiguration['destination']
    | MetricsPlanConfiguration['destination']
  nextDestination?:
    | LoggingPlanConfiguration['destination']
    | MetricsPlanConfiguration['destination']
}

function getObservabilitySettings(
  type: ObservabilityType,
  plan?: AnyPlan | null,
): LoggingPlanConfiguration | MetricsPlanConfiguration {
  const fieldName = type === `metrics` ? type : `logging`
  return get(plan, [`observability`, fieldName])
}

function buildObservabilityDifferenceCheck(type: ObservabilityType): DifferenceCheck {
  return {
    preconditions: [
      hasCurrent,
      hasNext,
      hasChangedPath({ pathBuilder: () => [[`observability`]] }),
    ],
    check: ({
      current,
      next,
      sliderInstanceType,
    }): Array<Difference<ObservabilityDifferenceMeta>> => {
      const currentSettings = getObservabilitySettings(type, current)
      const nextSettings = getObservabilitySettings(type, next)

      if (!currentSettings && !nextSettings) {
        return []
      }

      if (!currentSettings && nextSettings) {
        return [
          {
            type: `observability-enabled`,
            target: sliderInstanceType,
            meta: {
              nextDestination: nextSettings.destination,
              type,
            },
          },
        ]
      }

      if (currentSettings && !nextSettings) {
        return [
          {
            type: `observability-disabled`,
            target: sliderInstanceType,
            meta: {
              type,
            },
          },
        ]
      }

      const { cluster_id: currentCluster } = currentSettings.destination || {}
      const { cluster_id: nextCluster } = nextSettings.destination || {}

      if (currentCluster !== nextCluster) {
        return [
          {
            type: `observability-changed`,
            target: sliderInstanceType,
            meta: {
              type,
              currentDestination: currentSettings.destination,
              nextDestination: nextSettings.destination,
            },
          },
        ]
      }

      return []
    },
  }
}

export const diffLogging = buildObservabilityDifferenceCheck(`log`)
export const diffMetrics = buildObservabilityDifferenceCheck(`metrics`)
