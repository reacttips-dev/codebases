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

import { VACATE_ES_CLUSTER, VACATE_ES_CLUSTER_VALIDATE } from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { AsyncAction } from '../../types'
import {
  ClusterCommandResponse,
  TransientElasticsearchPlanConfiguration,
} from '../../lib/api/v1/types'

export interface State {
  vacates: {
    [crumbs: string]: ClusterCommandResponse | undefined
  }
  validateCalls: {
    [crumbs: string]: ClusterCommandResponse | undefined
  }
}

interface VacateEsClusterAction
  extends AsyncAction<typeof VACATE_ES_CLUSTER, ClusterCommandResponse> {
  meta: {
    regionId: string
    clusterId: string
    instanceIds: string[]
  }
}

interface VacateEsClusterValidateAction
  extends AsyncAction<typeof VACATE_ES_CLUSTER_VALIDATE, ClusterCommandResponse> {
  meta: {
    regionId: string
    clusterId: string
    instanceIds: string[]
  }
}

const initialState: State = {
  vacates: {},
  validateCalls: {},
}

export default function vacateEsClustersReducer(
  state: State = initialState,
  action: VacateEsClusterAction | VacateEsClusterValidateAction,
): State {
  if (action.type === VACATE_ES_CLUSTER) {
    const { regionId, clusterId, instanceIds } = action.meta
    const descriptor = createDescriptor(regionId, clusterId, instanceIds)

    if (!action.error && action.payload) {
      return replaceIn(state, ['vacates', descriptor], action.payload)
    }

    return replaceIn(state, ['vacates', descriptor], undefined)
  }

  if (action.type === VACATE_ES_CLUSTER_VALIDATE) {
    const { regionId, clusterId, instanceIds } = action.meta
    const descriptor = createDescriptor(regionId, clusterId, instanceIds)

    if (!action.error && action.payload) {
      return replaceIn(state, ['validateCalls', descriptor], action.payload)
    }

    return replaceIn(state, ['vacates', descriptor], undefined)
  }

  return state
}

export function getEsClusterVacate(
  state: State,
  regionId: string,
  clusterId: string,
  instanceIds: string[],
): TransientElasticsearchPlanConfiguration | undefined {
  return state.vacates[createDescriptor(regionId, clusterId, instanceIds)]
    ?.calculated_elasticsearch_plan
}

export function getEsClusterVacateValidate(
  state: State,
  regionId: string,
  clusterId: string,
  instanceIds: string[],
): TransientElasticsearchPlanConfiguration | undefined {
  return state.validateCalls[createDescriptor(regionId, clusterId, instanceIds)]
    ?.calculated_elasticsearch_plan
}

function createDescriptor(regionId: string, clusterId: string, instanceIds: string[]): string {
  return `${regionId}/${clusterId}/{${instanceIds.join(',')}}`
}
