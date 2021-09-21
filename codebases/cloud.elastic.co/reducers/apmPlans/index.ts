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

import { FETCH_APM_PLAN_ATTEMPTS } from '../../constants/actions'
import { planChangeErrorTypes } from '../lib/errorTypes'
import { replaceIn } from '../../lib/immutability-helpers'
import { ApmPlansInfo, ClusterPlanStepInfo } from '../../lib/api/v1/types'
import { enrichPlanAttemptsWithDiff } from '../../selectors'
import { PlanAttempt, AsyncAction } from '../../types'

import createPlanMessages from '../apms/createPlanMessages'

export interface State {
  history: { [descriptor: string]: PlanAttempt[] }
  pending: { [descriptor: string]: PlanAttempt | null }
}

interface FetchAction extends AsyncAction<typeof FETCH_APM_PLAN_ATTEMPTS, ApmPlansInfo> {
  meta: {
    regionId: string
    apmId: string
  }
}

export type Action = FetchAction

const initialState: State = {
  history: {},
  pending: {},
}

export default function plansReducer(plans: State = initialState, action: Action): State {
  if (action.type === FETCH_APM_PLAN_ATTEMPTS) {
    if (action.error || !action.payload) {
      return plans
    }

    const { regionId, apmId } = action.meta
    const id = `${regionId}/${apmId}`

    const withHistory = replaceIn(plans, [`history`, id], createHistory(action))
    const withPending = replaceIn(withHistory, [`pending`, id], createPendingAttempt(action))

    return withPending
  }

  return plans
}

function createHistory(action) {
  if (!action.payload.history) {
    return []
  }

  return action.payload.history.map(createAttempt)
}

function createPendingAttempt(action) {
  if (!action.payload.pending) {
    return null
  }

  return createAttempt(action.payload.pending)
}

function createAttemptId(rawId: string | null): number | null {
  if (!rawId) {
    return null
  }

  const maybeId = rawId.split(`attempt-`).pop()

  return maybeId ? parseInt(maybeId, 10) : null
}

export function createAttempt(attempt): PlanAttempt {
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
    kind: `apm`,
    id: createAttemptId(plan_attempt_name),
    diff: ``,
    isWaitingForPending: false,
    time: attempt_end_time || attempt_start_time,
    started: attempt_start_time,
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
  apmId: string,
): PlanAttempt[] | undefined {
  return state.history[`${regionId}/${apmId}`]
}

export function getPendingPlanAttempt(state: State, regionId: string, apmId: string) {
  return state.pending[`${regionId}/${apmId}`]
}

export function getPlanAttemptsWithDiff(
  state: State,
  regionId: string,
  apmId: string,
): PlanAttempt[] | undefined {
  const planAttempts = getPlanAttempts(state, regionId, apmId)
  return enrichPlanAttemptsWithDiff<PlanAttempt>(planAttempts)
}
