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

import { find, last } from 'lodash'
import moment from 'moment'

import {
  getPlanInfo,
  _getPlanInfoFromHistory,
  isSizedPlan,
  PlanState,
  getFirstEsClusterFromGet,
} from './fundamentals'

import {
  SliderInstanceType,
  AnyResourceInfo,
  AnyClusterPlanInfo,
  StackDeployment,
} from '../../../types'

import { planChangeErrorTypes } from '../../../reducers/lib/errorTypes'

import { DeploymentResources } from '../../api/v1/types'

type WithResources = {
  resources: DeploymentResources
}

export type PlanAttemptErrorDetails = { [key: string]: string }

export type ParsedPlanAttemptError = {
  message: string
  details: PlanAttemptErrorDetails
  errorType?: string
}

export function isPendingAttempt({ planAttempt }: { planAttempt: AnyClusterPlanInfo }): boolean {
  return !planAttempt.attempt_end_time
}

export function getDeploymentPlanAttemptId({
  deployment,
  sliderInstanceType,
  planAttempt,
}: {
  deployment: WithResources
  sliderInstanceType: SliderInstanceType
  planAttempt: AnyClusterPlanInfo
}): number | null {
  const { resources } = deployment
  const [resource] = resources[sliderInstanceType]

  return getPlanAttemptId({
    resource,
    planAttempt,
  })
}

export function getPlanAttemptId({
  resource,
  planAttempt,
}: {
  resource: AnyResourceInfo
  planAttempt: AnyClusterPlanInfo
}): number | null {
  const { plan_attempt_name: historyName } = planAttempt

  if (historyName !== undefined) {
    const historyNumber = parseInt(historyName.split('-')[1], 10)

    if (!isNaN(historyNumber)) {
      return historyNumber
    }
  }

  const {
    history,
    pending: pendingPlanAttempt,
    current: currentPlanAttempt,
  }: {
    history: AnyClusterPlanInfo[]
    pending?: AnyClusterPlanInfo
    current?: AnyClusterPlanInfo
  } = resource.info.plan_info

  if (planAttempt === pendingPlanAttempt || planAttempt === currentPlanAttempt) {
    const historyNumbers = history
      .map(({ plan_attempt_name: name }) => (name ? parseInt(name.split('-')[1], 10) : 0))
      .filter((number) => !isNaN(number))

    const maxHistoryNumber = Math.max(...historyNumbers)

    if (maxHistoryNumber >= 0) {
      return maxHistoryNumber + 1
    }

    return history.length
  }

  const historyIndex = history.indexOf(planAttempt)

  if (historyIndex !== -1) {
    return historyIndex
  }

  return null
}

export function getPlanBeforeAttempt({
  resource,
  planAttempt,
}: {
  resource: AnyResourceInfo
  planAttempt: AnyClusterPlanInfo
}) {
  const planInfo = resource.info.plan_info

  if (planAttempt === planInfo.pending) {
    return (planInfo.current && planInfo.current.plan) || null
  }

  if (planAttempt === planInfo.current) {
    const prevSuccess = _getPlanInfoFromHistory({ resource })
    return (prevSuccess && prevSuccess.plan) || null
  }

  const history: AnyClusterPlanInfo[] = planInfo.history
  const historyIndex = history.indexOf(planAttempt)

  if (historyIndex > 0) {
    return history[historyIndex - 1].plan || null
  }

  return null
}

export function getLastSizedPlanAttempt<TPlanInfo = AnyClusterPlanInfo>({
  deployment,
  sliderInstanceType,
}: {
  deployment: WithResources
  sliderInstanceType: SliderInstanceType
}): TPlanInfo | null {
  const { resources } = deployment
  const [resource] = resources[sliderInstanceType] as AnyResourceInfo[]

  if (!resource) {
    return null
  }

  const planInfo = _getPlanInfoFromHistory({ resource, mustMatch: hasSizedPlan })

  if (!planInfo) {
    return null
  }

  const castedPlanInfo = planInfo as unknown as TPlanInfo

  return castedPlanInfo

  function hasSizedPlan(planInfo: AnyClusterPlanInfo): boolean {
    return !!planInfo.plan && isSizedPlan(planInfo.plan)
  }
}

export function getLastPlanAttempt<TPlanInfo = AnyClusterPlanInfo>({
  deployment,
  sliderInstanceType,
}: {
  deployment: WithResources
  sliderInstanceType: SliderInstanceType
}): TPlanInfo | null {
  const { resources } = deployment
  const [resource] = resources[sliderInstanceType]

  if (!resource) {
    return null
  }

  const planInfo = getPlanInfo({ resource, state: `last_attempt` })
  return planInfo as any
}

export function parsePlanAttemptError({
  planAttempt,
}: {
  planAttempt: AnyClusterPlanInfo
}): ParsedPlanAttemptError | null {
  const { healthy, plan_attempt_log: messages } = planAttempt

  if (healthy) {
    return null
  }

  const errorMessage = find(messages, { status: `error` })

  /* the API might be confused and send us `healthy: false`
   * with no error status messages, so we need to be careful here,
   * as `errorMessage` might be `undefined`.
   */
  if (!errorMessage) {
    return null
  }

  const infoLogs = errorMessage.info_log

  for (const errorType of Object.keys(planChangeErrorTypes)) {
    for (const { details, message, internal_details } of infoLogs) {
      if (planChangeErrorTypes[errorType].test(message)) {
        return createParsedPlanAttemptError(message, details, internal_details, errorType)
      }
    }
  }

  const lastInfoLog = last(infoLogs)

  if (lastInfoLog == null) {
    return null
  }

  const { message, details, internal_details, failure_type } = lastInfoLog

  return createParsedPlanAttemptError(message, details, internal_details, failure_type)
}

export function getDeploymentCreateTimestamp({
  deployment,
}: {
  deployment: StackDeployment
}): Date | null {
  const resource = getFirstEsClusterFromGet({ deployment })

  if (resource === null) {
    return null
  }

  const state = 'genesis' as PlanState

  // If plan history is empty, it means the first plan is pending
  const genesisPlan = getPlanInfo({ resource, state })

  const startTime = genesisPlan ? moment(genesisPlan.attempt_start_time) : null

  if (!startTime || !startTime.isValid()) {
    return null
  }

  return startTime.toDate()
}

function createParsedPlanAttemptError(
  message: string,
  details: PlanAttemptErrorDetails,
  internalDetails?: PlanAttemptErrorDetails,
  errorType?: string,
): ParsedPlanAttemptError {
  return {
    message,
    details: {
      ...details,
      ...internalDetails,
    },
    errorType,
  }
}
