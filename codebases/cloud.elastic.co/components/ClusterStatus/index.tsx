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

import { getDeploymentHealthProblems } from '../../lib/healthProblems/reduxTypeBasedDeploymentHealth'

import { ApmCluster, ElasticsearchCluster, KibanaCluster } from '../../types'

export interface Props {
  cluster?: ElasticsearchCluster
  kibana?: KibanaCluster
  apm?: ApmCluster
}

interface StatusProps {
  status?: boolean | 'warning'
  iconType?: IconType
}

const ClusterStatus: FunctionComponent<Props> = ({ cluster, kibana, apm }) => {
  const mainDeployment = cluster || kibana || apm // goes away with v1 /deployments API

  if (!mainDeployment) {
    return <StatusBadge status='stopped' pending={true} />
  }

  // @ts-ignore props we might not have (isStopping) can be safely ignored
  const { plan, healthy, isStopped, isStopping } = mainDeployment

  const { isPending } = plan

  const [problems] = getDeploymentHealthProblems({
    deployment: cluster,
    kibanaCluster: kibana,
    apmCluster: apm,
  })

  if (find(problems, { id: `deployment-hidden` })) {
    return <StatusBadge status='warning' iconType='eyeClosed' />
  }

  if (find(problems, { id: `deployment-being-created` })) {
    return <StatusBadge pending={true} />
  }

  if (find(problems, { id: `failed-initial-plan` })) {
    return <StatusBadge status={false} />
  }

  if (isStopping) {
    return <StatusBadge status='stopped' pending={true} />
  }

  if (isPending) {
    return <StatusBadge pending={true} />
  }

  if (isStopped) {
    return <StatusBadge status='stopped' />
  }

  const severity = getHighestSeverity(problems)

  if (severity !== null) {
    const { status, iconType } = getStatusProps(severity)
    return <StatusBadge status={status} iconType={iconType} />
  }

  return <StatusBadge status={healthy} />
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

export default withErrorBoundary(ClusterStatus)
