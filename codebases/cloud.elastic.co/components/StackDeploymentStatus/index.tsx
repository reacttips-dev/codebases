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
import React, { FunctionComponent } from 'react'

import { IconType } from '@elastic/eui'

import StatusBadge from '../Status'

import { withErrorBoundary } from '../../cui'

import { getHighestSeverity, SeverityLevel } from '../../lib/healthProblems'

import { getDeploymentHealthProblems } from '../../lib/healthProblems/stackDeploymentHealth'

import {
  isEsStopping,
  isEsStopped,
  hasOngoingConfigurationChange,
} from '../../lib/stackDeployments'

import { DeploymentGetResponse, DeploymentSearchResponse } from '../../lib/api/v1/types'

type StackDeployment = DeploymentGetResponse | DeploymentSearchResponse

export interface Props {
  deployment?: StackDeployment
  iconShape?: string
}

interface StatusProps {
  status?: boolean | 'warning'
  iconType?: IconType
}

const StackDeploymentStatus: FunctionComponent<Props> = ({ deployment, iconShape }) => {
  if (!deployment) {
    return <StatusBadge status='stopped' pending={true} iconShape={iconShape} />
  }

  const [problems] = getDeploymentHealthProblems({
    deployment,
  })

  if (find(problems, { id: `deployment-hidden` })) {
    return <StatusBadge status='warning' iconType='eyeClosed' iconShape={iconShape} />
  }

  if (find(problems, { id: `deployment-being-created` })) {
    return <StatusBadge pending={true} iconShape={iconShape} />
  }

  if (find(problems, { id: `failed-initial-plan` })) {
    return <StatusBadge status={false} iconShape={iconShape} />
  }

  if (isEsStopping({ deployment })) {
    return <StatusBadge status='stopped' pending={true} iconShape={iconShape} />
  }

  if (hasOngoingConfigurationChange({ deployment })) {
    return <StatusBadge pending={true} iconShape={iconShape} />
  }

  if (isEsStopped({ deployment })) {
    return <StatusBadge status='stopped' iconShape={iconShape} />
  }

  const severity = getHighestSeverity(problems)

  if (severity !== null) {
    const { status, iconType } = getStatusProps(severity)
    return <StatusBadge status={status} iconType={iconType} iconShape={iconShape} />
  }

  return <StatusBadge status={deployment.healthy} iconShape={iconShape} />
}

function getStatusProps(severity: SeverityLevel): StatusProps {
  if (severity === `danger`) {
    return {
      status: false,
    }
  }

  if (severity === `warning`) {
    return {
      status: `warning`,
      iconType: `wrench`,
    }
  }

  if (severity === `info`) {
    return {
      status: true,
    }
  }

  return {}
}

export default withErrorBoundary(StackDeploymentStatus)
