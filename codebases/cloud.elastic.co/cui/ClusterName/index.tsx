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

import React, { FunctionComponent } from 'react'

import {
  EuiCode,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,

  // @ts-ignore: actually
  EuiHighlight,
  EuiLoadingSpinner,
} from '@elastic/eui'

import { CuiLink } from '../Link'

import { getClusterHealthColor } from '../../lib/healthProblems/clusterHealth'

import { resolveDeploymentUrlForEsCluster, sliderUrl } from '../../lib/urlBuilder'

import { Cluster } from '../../types'

type Props = {
  cluster?: Cluster | null
  linkify?: boolean
  showHealth?: boolean
  highlight?: string
  className?: string
}

export const CuiClusterName: FunctionComponent<Props> = ({
  cluster,
  linkify = true,
  showHealth = true,
  highlight = ``,
  className,
}) => {
  if (!cluster) {
    return <EuiLoadingSpinner size='m' />
  }

  const { id, stackDeploymentId } = cluster

  // @ts-ignore TS doesn't understand but we're ok that it might not be a thing
  const name: string | undefined = cluster.name
  const displayId = stackDeploymentId ? stackDeploymentId.slice(0, 6) : id.slice(0, 6)

  const clusterName = (
    <EuiFlexGroup gutterSize='s' alignItems='center'>
      <EuiFlexItem grow={false}>
        <EuiCode>{displayId}</EuiCode>
      </EuiFlexItem>

      {name && (
        <EuiFlexItem grow={false}>
          <EuiHighlight search={highlight}>{name}</EuiHighlight>
        </EuiFlexItem>
      )}
    </EuiFlexGroup>
  )

  const clusterNameLinked = linkify ? (
    <CuiLink to={getClusterUrl(cluster)}>{clusterName}</CuiLink>
  ) : (
    clusterName
  )

  const clusterNameClassed = <span className={className}>{clusterNameLinked}</span>

  const clusterNameHealth = showHealth ? (
    <EuiHealth color={getClusterHealthColor(cluster)}>{clusterNameClassed}</EuiHealth>
  ) : (
    clusterNameClassed
  )

  return clusterNameHealth
}

function getClusterUrl(cluster: Cluster): string {
  return resolveDeploymentUrlForEsCluster(
    sliderUrl,
    cluster.regionId,
    cluster.stackDeploymentId!,
    cluster.kind,
  )
}
