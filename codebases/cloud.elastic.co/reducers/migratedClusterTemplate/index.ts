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

import {
  RESET_PENDING_MIGRATE_TEMPLATE,
  SET_PENDING_MIGRATE_TEMPLATE,
} from '../../constants/actions'
import { ElasticsearchClusterPlan } from '../../lib/api/v1/types'

export interface State {
  ElasticsearchClusterPlan?
}

type setPendingMigrateTemplate = {
  type: typeof SET_PENDING_MIGRATE_TEMPLATE
  error?: string
  meta: {
    template: string
    clusterId: string
    state: 'started' | 'failed' | 'success'
  }
  payload: ElasticsearchClusterPlan
}

type resetPendingMigrateTemplate = {
  type: typeof RESET_PENDING_MIGRATE_TEMPLATE
  meta: {
    template: string
    clusterId: string
  }
}

type Action = setPendingMigrateTemplate | resetPendingMigrateTemplate

export default function migratedClusterTemplate(state: State = {}, action: Action) {
  if (action.type === SET_PENDING_MIGRATE_TEMPLATE) {
    if (action.meta.state === `success`) {
      return {
        [action.meta.clusterId]: { ...action.payload },
      }
    }
  }

  if (action.type === RESET_PENDING_MIGRATE_TEMPLATE) {
    return {}
  }

  return state
}

export function getMigratedClusterTemplate(state, clusterId) {
  return state[clusterId]
}
