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
import { getPlanVersion, isSizedPlan } from '../selectors'
import { hasCurrent } from './preconditions'
import { DifferenceCheck } from './types'

export const diffPruneOrphans: DifferenceCheck = {
  preconditions: [hasCurrent],
  check: ({ current, next, sliderInstanceType, pruneOrphans }) => {
    if (!pruneOrphans) {
      return []
    }

    const isCurrentPlanSized = current && isSizedPlan(current)
    const isNextPlanSized = next && isSizedPlan(next)

    if (!isCurrentPlanSized || isNextPlanSized) {
      return []
    }

    return [
      {
        type: `resource-pruned-out`,
        target: sliderInstanceType,
        meta: {
          currentVersion: getPlanVersion({ plan: current }),
        },
      },
    ]
  },
}
