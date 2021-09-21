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

import { isEqual } from 'lodash'
import { ElasticsearchClusterPlan } from '../../api/v1/types'
import { hasCurrent, hasNext, isElasticsearch } from './preconditions'
import { Difference, DifferenceCheck, DifferenceType } from './types'

export const diffCuration: DifferenceCheck = {
  preconditions: [isElasticsearch, hasCurrent, hasNext],
  check: ({ current, next, sliderInstanceType }) => {
    const currentEs = current as ElasticsearchClusterPlan
    const nextEs = next as ElasticsearchClusterPlan

    const currentCuration = currentEs.elasticsearch.curation
    const nextCuration = nextEs.elasticsearch.curation

    if (isEqual(currentCuration, nextCuration)) {
      return []
    }

    const fieldsToCheck = [
      { field: 'from_instance_configuration_id', type: 'source' },
      { field: 'to_instance_configuration_id', type: 'dest' },
    ]
    return fieldsToCheck
      .map(({ field, type }): Difference<{ current: string; next: string }> | null => {
        const currentField = currentCuration && currentCuration[field]
        const nextField = nextCuration && nextCuration[field]

        if (currentField === nextField) {
          return null
        }

        return {
          type: `es-curation-${type}` as DifferenceType,
          target: sliderInstanceType,
          meta: {
            current: currentField,
            next: nextField,
          },
        }
      })
      .filter((diff): diff is Difference<{ current: string; next: string }> => diff !== null)
  },
}
