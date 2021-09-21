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

import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiLoadingSpinner, EuiSpacer, EuiText } from '@elastic/eui'

import ClusterSnapshotList from './ClusterSnapshotList'
import ClusterSnapshotNotices from './ClusterSnapshotNotices'

import SlmCallouts from './SlmCallouts'

import SnapshotStatus from './SnapshotStatus'
import SlmSnapshotStatus from './SlmSnapshotStatus'

import SnapshotActions from './SnapshotActions'
import SlmSnapshotActions from './SlmSnapshotActions'

import UpdateSnapshotRepository from './UpdateSnapshotRepository'

import { getFirstEsClusterFromGet, hasSlm } from '../../../lib/stackDeployments'

import { isPermitted } from '../../../lib/requiresPermission'
import Permission from '../../../lib/api/v1/permissions'

import { WithStackDeploymentRouteParamsProps } from '../../StackDeploymentEditor'
import {
  AsyncRequestState,
  ClusterSnapshot,
  DeploymentSnapshotState,
  ElasticsearchCluster,
  StackDeployment,
} from '../../../types'

import './clusterSnapshots.scss'

export type StateProps = {
  cluster: ElasticsearchCluster | null
  stackDeployment?: StackDeployment | null
  hasDefaultSnapshotRepository: boolean
  isUserConsole: boolean
  isHeroku: boolean
  snapshotHistory: ClusterSnapshot[] | null
  snapshotSettings: DeploymentSnapshotState | null
  snapshotSettingsEnabled: boolean
  fetchSnapshotSettingsRequest: AsyncRequestState
}

export type DispatchProps = {
  fetchSnapshotSettings: (cluster: ElasticsearchCluster) => void
}

export type ConsumerProps = WithStackDeploymentRouteParamsProps

export type AllProps = StateProps & DispatchProps & ConsumerProps

class ClusterSnapshots extends Component<AllProps> {
  componentDidMount(): void {
    const { fetchSnapshotSettings, cluster } = this.props

    if (cluster) {
      fetchSnapshotSettings(cluster)
    }
  }

  render(): JSX.Element | null {
    const {
      cluster,
      stackDeployment,
      isUserConsole,
      hasDefaultSnapshotRepository = false,
      snapshotSettings,
      snapshotSettingsEnabled,
      fetchSnapshotSettingsRequest,
      regionId,
      deploymentId,
      snapshotHistory,
      isHeroku,
    } = this.props

    if (!cluster?._raw.plan) {
      return null
    }

    if (cluster?.isStopped) {
      return null
    }

    if (stackDeployment == null) {
      return <EuiLoadingSpinner size='m' />
    }

    const { snapshots } = cluster
    const status = snapshots.status || {}
    const { pendingInitialSnapshot } = status
    const snapshotsEnabled = snapshots.enabled
    const manageSnapshotRepositories =
      !isUserConsole &&
      !hasDefaultSnapshotRepository &&
      isPermitted(Permission.getSnapshotRepositories)

    const useSlm = isUsingSlm({
      deployment: stackDeployment,
      snapshotSettings,
    })

    if (fetchSnapshotSettingsRequest.inProgress) {
      return <EuiLoadingSpinner size='m' />
    }

    return (
      <Fragment>
        {snapshotsEnabled && <SlmCallouts />}

        {isUserConsole && <SnapshotsOverviewSaas />}

        {snapshotsEnabled && (
          <Fragment>
            {useSlm ? (
              <SlmSnapshotStatus status={status} />
            ) : (
              <SnapshotStatus
                status={status}
                snapshotSettings={snapshotSettings}
                fetchSnapshotSettingsRequest={fetchSnapshotSettingsRequest}
                deployment={cluster}
                isUserConsole={isUserConsole}
                canEditSettings={!isHeroku && snapshotSettingsEnabled && !pendingInitialSnapshot}
              />
            )}
          </Fragment>
        )}

        <ClusterSnapshotNotices cluster={cluster} isUserConsole={isUserConsole} />

        {useSlm ? (
          <SlmSnapshotActions
            regionId={regionId}
            deploymentId={deploymentId!}
            stackDeployment={stackDeployment}
            snapshotsEnabled={snapshotsEnabled}
            showRestoreSnapshotButton={!isHeroku}
            canManageRepos={manageSnapshotRepositories}
          />
        ) : (
          <Fragment>
            <SnapshotActions
              regionId={regionId}
              deploymentId={deploymentId!}
              stackDeployment={stackDeployment}
              snapshotsEnabled={snapshotsEnabled}
              showRestoreSnapshotButton={!isHeroku}
            />

            {manageSnapshotRepositories && <UpdateSnapshotRepository cluster={cluster} />}
          </Fragment>
        )}

        <ClusterSnapshotList
          cluster={cluster}
          snapshotHistory={snapshotHistory}
          readonly={useSlm}
        />
      </Fragment>
    )
  }
}

function SnapshotsOverviewSaas() {
  return (
    <Fragment>
      <EuiText>
        <FormattedMessage
          id='cluster-snapshots.saas-overview'
          defaultMessage='Snapshots are backups of your data that you can restore in the event of an unexpected data loss.'
        />
      </EuiText>

      <EuiSpacer size='m' />
    </Fragment>
  )
}

function isUsingSlm({
  deployment,
  snapshotSettings,
}: {
  deployment?: StackDeployment | null
  snapshotSettings: DeploymentSnapshotState | null
}): boolean {
  // This makes sure we are in sync with child components
  if (deployment) {
    const resource = getFirstEsClusterFromGet({ deployment })!
    return hasSlm({ resource })
  }

  return Boolean(snapshotSettings?.slm)
}

export default ClusterSnapshots
