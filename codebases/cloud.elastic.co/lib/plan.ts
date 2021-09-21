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

import { capitalize, get } from 'lodash'

import { planPaths } from '../config/clusterPaths'
import descriptions from './planMessageDescriptions'

import { ChangeSourceInfo, ClusterPlanStepInfo } from './api/v1/types'

type StepDescription = {
  status?: string
  value: string
}

export function hasWatcher(plan): boolean {
  const plugins = get(plan, planPaths.plugins, [])
  return plugins.includes(`watcher`)
}

export function formatStep(stepId: string): string {
  if (!stepId) {
    return stepId
  }

  return capitalize(stepId.replace(/-/g, ` `))
}

export function describePlanAttemptStep(
  planAttemptMessage: ClusterPlanStepInfo,
  { isCancelled }: { isCancelled?: boolean } = {},
): StepDescription {
  const { step_id: stepId } = planAttemptMessage
  const description = descriptions.get(stepId) || formatStep(stepId)

  // An array of stepIds that should be returning an error status
  const errors = [`step-failed`, `rollback`, `step-rollback`, `error`]

  if (isCancelled) {
    return {
      status: `error`,
      value: `Cancelling changes`,
    }
  }

  if (stepId === `plan-completed` || stepId === `success`) {
    return {
      status: `success`,
      value: description,
    }
  }

  if (errors.includes(stepId)) {
    return {
      status: `error`,
      value: description,
    }
  }

  return {
    value: description,
  }
}

export function describePlanAttemptSource({ source }: { source: ChangeSourceInfo }): string | null {
  if (typeof source.action !== `string`) {
    return null
  }

  if (source.action.endsWith(`move-instances`)) {
    return `Moving nodes`
  }

  return null
}
