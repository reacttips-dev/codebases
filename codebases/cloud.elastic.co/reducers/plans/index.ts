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

import { last, find, keys } from 'lodash'

import { planChangeErrorTypes } from '../lib/errorTypes'

import createPlanMessages from '../clusters/createPlanMessages'

import { FETCH_PLAN_ATTEMPTS } from '../../constants/actions'
import { enrichPlanAttemptsWithDiff } from '../../selectors'
import { replaceIn } from '../../lib/immutability-helpers'

import { AsyncAction, ElasticsearchId, PlanAttempt, RegionId } from '../../types'
import {
  ClusterPlanStepInfo,
  ElasticsearchClusterPlanInfo,
  ElasticsearchClusterPlansInfo,
} from '../../lib/api/v1/types'

export interface State {
  history: { [descriptor: string]: PlanAttempt[] }
  pending: { [descriptor: string]: PlanAttempt | undefined }
}

interface FetchPlanAttemptsAction
  extends AsyncAction<typeof FETCH_PLAN_ATTEMPTS, ElasticsearchClusterPlansInfo> {
  meta: { regionId: string; clusterId: string }
}

const initialState: State = {
  history: {},
  pending: {},
}

export default function plansReducer(
  state: State = initialState,
  action: FetchPlanAttemptsAction,
): State {
  if (action.type === FETCH_PLAN_ATTEMPTS) {
    if (action.error || !action.payload) {
      return state
    }

    const { regionId, clusterId } = action.meta
    const id = `${regionId}/${clusterId}`

    const withHistory = replaceIn(state, [`history`, id], createHistory(action.payload))
    const withPending = replaceIn(
      withHistory,
      [`pending`, id],
      createPendingAttempt(action.payload),
    )

    return withPending
  }

  return state
}

function createHistory(payload: ElasticsearchClusterPlansInfo) {
  if (!payload.history) {
    return []
  }

  return payload.history.map(createAttempt)
}

function createPendingAttempt(payload: ElasticsearchClusterPlansInfo) {
  if (!payload.pending) {
    return null
  }

  return createAttempt(payload.pending)
}

function createAttemptId(rawId: string | null | undefined): number | null {
  if (!rawId) {
    return null
  }

  const maybeId = rawId.split(`attempt-`).pop()

  return maybeId ? parseInt(maybeId, 10) : null
}

function createError(messages: ClusterPlanStepInfo[]) {
  const errorMessage = find(messages, { status: `error` })

  /* the API might be confused and send us `healthy: false`
   * with no error status messages, so we need to be careful here,
   * as `errorMessage` might be `undefined`.
   */
  if (errorMessage == null) {
    return null
  }

  const infoLog = errorMessage.info_log

  for (const type of keys(planChangeErrorTypes)) {
    for (const logLine of infoLog) {
      if (planChangeErrorTypes[type].test(logLine.message)) {
        return {
          message: logLine.message,
          type,
        }
      }
    }
  }

  const lastLogLine = last(infoLog)

  if (lastLogLine == null) {
    return null
  }

  return {
    message: lastLogLine.message,
  }
}

export function createAttempt(attempt: ElasticsearchClusterPlanInfo): PlanAttempt {
  const {
    healthy,
    plan_attempt_name,
    attempt_end_time,
    attempt_start_time,
    plan,
    plan_attempt_log,
    source,
  } = attempt

  const messages = createPlanMessages(plan_attempt_log)

  return {
    kind: `elasticsearch`,
    id: createAttemptId(plan_attempt_name),
    diff: null,
    isWaitingForPending: false,
    time: attempt_end_time || attempt_start_time || new Date().toISOString(),
    started: attempt_start_time || new Date().toISOString(),
    ended: attempt_end_time,
    isPending: !attempt_end_time,
    plan: {
      _source: plan,
    },
    healthy,
    status: {
      failed: plan_attempt_log.filter((each) => each.status === `error`).length,
      error: healthy ? null : createError(plan_attempt_log),
    },
    messages,
    source:
      source == null
        ? {}
        : {
            action: source.action,
            adminId: source.admin_id,
            facilitator: source.facilitator,
            userId: source.user_id,
            remoteAddresses: source.remote_addresses,
          },
  }
}

export function getPlanAttempts(state: State, regionId: RegionId, clusterId: ElasticsearchId) {
  return state.history[`${regionId}/${clusterId}`]
}

export function getPendingPlanAttempt(
  state: State,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) {
  return state.pending[`${regionId}/${clusterId}`]
}

export function getPlanAttemptsWithDiff(
  state: State,
  regionId: string,
  clusterId: string,
): PlanAttempt[] | undefined {
  const planAttempts = getPlanAttempts(state, regionId, clusterId)
  return enrichPlanAttemptsWithDiff(planAttempts)
}
