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

import { last, keys, find } from 'lodash'

import { planChangeErrorTypes } from '../lib/errorTypes'

import createPlanMessages from '../kibanas/createPlanMessages'

import { FETCH_KIBANA_PLAN_ATTEMPTS } from '../../constants/actions'

import { enrichPlanAttemptsWithDiff } from '../../selectors'

import { AsyncAction, PlanAttempt } from '../../types'
import {
  ClusterPlanStepInfo,
  KibanaClusterPlanInfo,
  KibanaClusterPlansInfo,
} from '../../lib/api/v1/types'

export interface State {
  history: { [id: string]: PlanAttempt[] }
  pending: { [id: string]: PlanAttempt | null }
}

interface FetchKibanaPlanAttemptsAction
  extends AsyncAction<typeof FETCH_KIBANA_PLAN_ATTEMPTS, KibanaClusterPlansInfo> {
  meta: { regionId: string; kibanaId: string }
}

const initialState: State = {
  history: {},
  pending: {},
}

export default function plansReducer(
  state: State = initialState,
  action: FetchKibanaPlanAttemptsAction,
): State {
  if (action.type === FETCH_KIBANA_PLAN_ATTEMPTS) {
    if (action.error || !action.payload) {
      return state
    }

    const { regionId, kibanaId } = action.meta
    const id = `${regionId}/${kibanaId}`

    return {
      history: {
        ...state.history,
        [id]: createHistory(action.payload),
      },
      pending: {
        ...state.pending,
        [id]: createPendingAttempt(action.payload),
      },
    }
  }

  return state
}

function createHistory(payload: KibanaClusterPlansInfo) {
  if (!payload.history) {
    return []
  }

  return payload.history.map(createAttempt)
}

function createPendingAttempt(payload: KibanaClusterPlansInfo) {
  if (!payload.pending) {
    return null
  }

  return createAttempt(payload.pending)
}

export function createAttempt(attempt: KibanaClusterPlanInfo): PlanAttempt {
  const {
    plan_attempt_name,
    attempt_end_time,
    attempt_start_time,
    plan,
    healthy,
    plan_attempt_log,
    source,
  } = attempt

  const messages = createPlanMessages(plan_attempt_log)

  return {
    kind: `kibana`,
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
    messages,
    status: {
      error: healthy ? null : createError(messages),
    },
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

export function getPlanAttempts(
  state: State,
  regionId: string,
  kibanaId: string,
): PlanAttempt[] | undefined {
  return state.history[`${regionId}/${kibanaId}`]
}

export function getPendingKibanaPlanAttempt(state, regionId, kibanaId) {
  return state.pending[`${regionId}/${kibanaId}`]
}

export function getKibanaPlanAttemptsWithDiff(
  state: State,
  regionId: string,
  kibanaId: string,
): PlanAttempt[] | undefined {
  const planAttempts = getPlanAttempts(state, regionId, kibanaId)
  return enrichPlanAttemptsWithDiff<PlanAttempt>(planAttempts)
}
