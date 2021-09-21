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

import { find } from 'lodash'

import { hasOngoingConfigurationChange, isEsStopped, isEsStopping } from './selectors'

import { getHighestSeverity } from '../healthProblems'
import { getDeploymentHealthProblems } from '../healthProblems/stackDeploymentHealth'

import { StackDeployment, DeploymentStatus } from '../../types'

export function getDeploymentStatus({
  deployment,
}: {
  deployment: StackDeployment
}): DeploymentStatus {
  const { healthy } = deployment
  const [problems] = getDeploymentHealthProblems({ deployment })
  const severity = getHighestSeverity(problems)

  if (hasWarnings(problems, severity)) {
    return { healthy, status: 'warning' }
  }

  if (isEsStopping({ deployment })) {
    return { healthy, status: 'stopping' }
  }

  if (isPending(problems, hasOngoingConfigurationChange({ deployment }))) {
    return { healthy, status: 'pending' }
  }

  if (isEsStopped({ deployment })) {
    return { healthy, status: 'stopped' }
  }

  if (isUnhealthy(problems, severity)) {
    return { healthy, status: 'unhealthy' }
  }

  if (severity === `info`) {
    return { healthy, status: 'healthy' }
  }

  return { healthy, status: healthy ? 'healthy' : 'unhealthy' }
}

function hasWarnings(problems, severity) {
  return find(problems, { id: `deployment-hidden` }) || severity === `warning`
}

function isPending(problems, pending) {
  return pending || find(problems, { id: `deployment-being-created` })
}

function isUnhealthy(problems, severity) {
  return find(problems, { id: `failed-initial-plan` }) || severity === `danger`
}
