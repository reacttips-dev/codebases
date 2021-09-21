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

import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiSpacer, EuiHorizontalRule, EuiTitle } from '@elastic/eui'

import TempShieldUsers from './TempShieldUsers'
import ProxyLogging from './ProxyLogging'
import CpuHardLimit from './CpuHardLimit'
import ClusterDiagnosticBundle from './ClusterDiagnosticBundle'
import RetryFailedShards from './RetryFailedShards'
import ClusterLogs from './ClusterLogs'
import ClusterLocking from './ClusterLocking'

import DeploymentIndexCurationIndices from './DeploymentIndexCurationIndices'

import { getClusterMetadata } from '../../reducers/clusters'

import { gte } from '../../lib/semver'
import { isClusterActive } from '../../lib/clusters'
import { hasPermission } from '../../lib/requiresPermission'

import { getConfigForKey } from '../../store'

import Permission from '../../lib/api/v1/permissions'

import './clusterManage.scss'

function DeploymentOperations({ cluster, tempShieldUsersActivated }) {
  if (!isClusterActive(cluster) && cluster.plan.isPending) {
    return null // while creating, we already show a message
  }

  const { regionId, id: clusterId } = cluster

  const canRetryFailedShards =
    cluster.plan.version != null ? gte(cluster.plan.version, `5.0.0`) : false

  const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`

  return (
    <div>
      <DeploymentIndexCurationIndices cluster={cluster} />

      {!isUserConsole && (
        <Fragment>
          <EuiTitle>
            <h3>
              <FormattedMessage id='cluster-manage-index.settings' defaultMessage='Settings' />
            </h3>
          </EuiTitle>

          <EuiSpacer size='s' />

          <ProxyLogging cluster={cluster} />
          <CpuHardLimit cluster={cluster} />
          <ClusterLocking cluster={cluster} />

          <EuiHorizontalRule />

          <EuiTitle>
            <h3>
              <FormattedMessage
                id='cluster-manage-index.help-actions'
                defaultMessage='Help Actions'
              />
            </h3>
          </EuiTitle>

          <EuiSpacer size='s' />

          {tempShieldUsersActivated && hasPermission(Permission.setEsClusterMetadataRaw) && (
            <Fragment>
              <EuiTitle size='xs'>
                <h3>
                  <FormattedMessage
                    id='cluster-manage-index.temporary-shield-users'
                    defaultMessage='Temporary shield users'
                  />
                </h3>
              </EuiTitle>

              <TempShieldUsers
                regionId={regionId}
                clusterId={clusterId}
                users={cluster.security.internalUsers}
                data={getClusterMetadata(cluster)}
              />

              <EuiSpacer size='m' />
            </Fragment>
          )}

          <RetryFailedShards
            regionId={regionId}
            clusterId={clusterId}
            canRetryFailedShards={canRetryFailedShards}
          />

          <EuiSpacer size='m' />

          <ClusterDiagnosticBundle regionId={regionId} clusterId={clusterId} />

          <EuiSpacer size='m' />

          <ClusterLogs regionId={regionId} clusterId={clusterId} />
        </Fragment>
      )}
    </div>
  )
}

export default DeploymentOperations
