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

import { hasCurrent, hasNext, isElasticsearch } from './preconditions'

import { ElasticsearchClusterPlan } from '../../api/v1/types'
import { DifferenceCheck } from './types'

export const diffAutoscaling: DifferenceCheck = {
  preconditions: [hasCurrent, hasNext, isElasticsearch],
  check: ({ current, next }) => {
    const currentEs = current as ElasticsearchClusterPlan
    const nextEs = next as ElasticsearchClusterPlan

    // If it flips its value to true, then it's enabled
    if (!currentEs.autoscaling_enabled && nextEs.autoscaling_enabled) {
      return [
        {
          type: `autoscaling-enabled`,
          target: `deployment`,
        },
      ]
    }

    // If it flips its value to false, then it's disabled
    if (currentEs.autoscaling_enabled && !nextEs.autoscaling_enabled) {
      return [
        {
          type: `autoscaling-disabled`,
          target: `deployment`,
        },
      ]
    }

    // If it's same value or not set, it's a no-op
    return []
  },
}
