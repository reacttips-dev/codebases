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
import { Link } from 'react-router-dom'
import { map, isEmpty } from 'lodash'

import { EuiFlexGroup, EuiFlexItem, EuiSelect, EuiLoadingSpinner, EuiFormRow } from '@elastic/eui'

import { CuiAlert, CuiPermissibleControl } from '../../../../cui'

import SpinButton from '../../../SpinButton'
import DangerButton from '../../../DangerButton'

import { createSnapshotRepositoryUrl } from '../../../../lib/urlBuilder'
import schedule from '../../../../lib/schedule'
import Permission from '../../../../lib/api/v1/permissions'

import {
  AsyncRequestState,
  ElasticsearchCluster,
  ElasticsearchId,
  RegionId,
  SnapshotRepository,
} from '../../../../types'

import './updateSnapshotRepository.scss'

type Props = {
  cluster: ElasticsearchCluster
  snapshotRepositories?: { [repoId: string]: SnapshotRepository }
  fetchSnapshotRepositoriesRequest: AsyncRequestState
  setSnapshotRepositoryRequest: AsyncRequestState
  disableSnapshotsForClusterRequest: AsyncRequestState
  fetchSnapshotRepositories: (regionId: RegionId) => void
  setSnapshotRepository: (cluster: ElasticsearchCluster, snapshotRepositoryId: string) => void
  resetSetSnapshotRepositoryRequest: (regionId: RegionId, clusterId: ElasticsearchId) => void
  disableSnapshotsForCluster: (cluster: ElasticsearchCluster) => void
  resetDisableSnapshotsForClusterRequest: (regionId: RegionId, clusterId: ElasticsearchId) => void
}
type State = {
  snapshotRepositoryId: string
}

class UpdateSnapshotRepository extends Component<Props, State> {
  state: State = {
    snapshotRepositoryId: this.props.cluster.snapshots.snapshotRepositoryId || ``,
  }

  componentWillUnmount() {
    const { cluster, resetSetSnapshotRepositoryRequest, resetDisableSnapshotsForClusterRequest } =
      this.props
    resetSetSnapshotRepositoryRequest(cluster.regionId, cluster.id)
    resetDisableSnapshotsForClusterRequest(cluster.regionId, cluster.id)
  }

  render() {
    const {
      cluster,
      snapshotRepositories,
      setSnapshotRepositoryRequest,
      fetchSnapshotRepositoriesRequest,
      disableSnapshotsForClusterRequest,
    } = this.props

    const savedSnapshotRepositoryId = this.props.cluster.snapshots.snapshotRepositoryId

    const { snapshotRepositoryId } = this.state

    const enabledSnapshots = this.hasEnabledSnapshots()

    if (fetchSnapshotRepositoriesRequest.error) {
      return <CuiAlert type='error'>{fetchSnapshotRepositoriesRequest.error}</CuiAlert>
    }

    if (!snapshotRepositories) {
      return <EuiLoadingSpinner />
    }

    const noSnapshotRepositoriesDefined = isEmpty(snapshotRepositories)

    if (noSnapshotRepositoriesDefined) {
      return (
        <Fragment>
          <CuiAlert iconType='faceSad' type='warning'>
            <FormattedMessage
              id='cluster-manage-update-snapshot-repository.no-repos'
              defaultMessage='You do not have any snapshot repositories set up. {addLink} to enable snapshots for your Elasticsearch clusters.'
              values={{
                addLink: (
                  <CuiPermissibleControl permissions={Permission.setSnapshotRepository}>
                    <Link to={createSnapshotRepositoryUrl(cluster.regionId)}>
                      <FormattedMessage
                        id='cluster-manage-update-snapshot-repository.no-repos-link'
                        defaultMessage='Add a repository'
                      />
                    </Link>
                  </CuiPermissibleControl>
                ),
              }}
            />
          </CuiAlert>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <EuiFormRow
          label={
            <FormattedMessage
              id='cluster-manage-update-snapshot-repository.title'
              defaultMessage='Snapshot repository'
            />
          }
        >
          <EuiFlexGroup gutterSize='s'>
            <EuiFlexItem className='updateSnapshotRepository-options'>
              <EuiSelect
                data-test-id='update-snapshot-repo-for-deployment'
                value={snapshotRepositoryId}
                onChange={(e) => this.setState({ snapshotRepositoryId: e.target.value })}
                options={[
                  ...(snapshotRepositoryId ? [] : [{ text: `` }]),
                  ...map(snapshotRepositories, (repo) => ({
                    value: repo.repository_name,
                    text: repo.config.type
                      ? `${repo.repository_name} (${repo.config.type})`
                      : repo.repository_name,
                  })),
                ]}
              />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <CuiPermissibleControl permissions={Permission.updateEsClusterMetadataSettings}>
                <SpinButton
                  data-test-id='save-snapshot-repo-button'
                  color='primary'
                  onClick={() => this.setSnapshotRepository()}
                  disabled={
                    !snapshotRepositoryId ||
                    (enabledSnapshots && snapshotRepositoryId === savedSnapshotRepositoryId)
                  }
                  spin={setSnapshotRepositoryRequest.inProgress}
                  requiresSudo={true}
                >
                  {enabledSnapshots ? (
                    <FormattedMessage
                      id='cluster-manage-update-snapshot-repository.save-repository-enabled'
                      defaultMessage='Save repository'
                    />
                  ) : (
                    <FormattedMessage
                      id='cluster-manage-update-snapshot-repository.save-repository-and-enable'
                      defaultMessage='Save repository and enable snapshots'
                    />
                  )}
                </SpinButton>
              </CuiPermissibleControl>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFormRow>

        {setSnapshotRepositoryRequest.error && (
          <CuiAlert type='error' className='updateSnapshotRepository-error'>
            {setSnapshotRepositoryRequest.error}
          </CuiAlert>
        )}

        {setSnapshotRepositoryRequest.isDone && (
          <CuiAlert type='info' className='updateSnapshotRepository-success'>
            <FormattedMessage
              id='cluster-manage-update-snapshot-repository.success-message'
              defaultMessage='This Elasticsearch cluster will now use the chosen snapshot repository.'
            />
          </CuiAlert>
        )}

        {enabledSnapshots && (
          <div className='disableSnapshots'>
            <CuiPermissibleControl permissions={Permission.updateEsClusterMetadataSettings}>
              <DangerButton
                data-test-id='disable-snapshots-for-deployment'
                className='disableSnapshots-btn'
                onConfirm={() => this.disableSnapshotsForCluster()}
                isBusy={disableSnapshotsForClusterRequest.inProgress}
                modal={{
                  title: (
                    <FormattedMessage
                      id='cluster-manage-disable-snapshot-repository.confirm-disable-snapshots'
                      defaultMessage='Confirm to disable snapshots'
                    />
                  ),
                  body: (
                    <FormattedMessage
                      id='cluster-manage-disable-snapshot-repository.explanation'
                      defaultMessage='Disabling snapshots can lead to data loss. Without a backup of your data, this Elasticsearch cluster will not be able to recover from failures.'
                    />
                  ),
                }}
              >
                <FormattedMessage
                  id='cluster-manage-disable-snapshot-repository.disable-snapshots'
                  defaultMessage='Disable snapshots'
                />
              </DangerButton>
            </CuiPermissibleControl>
          </div>
        )}

        {disableSnapshotsForClusterRequest.error && (
          <CuiAlert type='error' className='updateSnapshotRepository-error'>
            {disableSnapshotsForClusterRequest.error}
          </CuiAlert>
        )}

        {disableSnapshotsForClusterRequest.isDone && (
          <CuiAlert type='info' className='updateSnapshotRepository-success disabledSnapshots'>
            <FormattedMessage
              id='cluster-manage-disable-snapshot-repository.success-message'
              defaultMessage='This Elasticsearch cluster now has snapshots disabled.'
            />
          </CuiAlert>
        )}
      </Fragment>
    )
  }

  hasEnabledSnapshots() {
    const { cluster } = this.props
    return cluster.snapshots.enabled
  }

  disableSnapshotsForCluster() {
    const { cluster, disableSnapshotsForCluster } = this.props
    disableSnapshotsForCluster(cluster)
  }

  setSnapshotRepository() {
    const { snapshotRepositoryId } = this.state
    const { cluster, setSnapshotRepository } = this.props
    setSnapshotRepository(cluster, snapshotRepositoryId)
  }
}

export default schedule(
  UpdateSnapshotRepository,
  ({ cluster, fetchSnapshotRepositories }) => fetchSnapshotRepositories(cluster.regionId),
  [[`cluster`, `regionId`]],
)
