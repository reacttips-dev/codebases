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

import {
  EuiButton,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiLoadingSpinner,
  EuiSelect,
  EuiSpacer,
} from '@elastic/eui'

import { CuiAlert, CuiPermissibleControl } from '../../../../cui'

import ClusterLockingGate from '../../../ClusterLockingGate'

import SpinButton from '../../../SpinButton'
import DangerButton from '../../../DangerButton'

import TakeSnapshotButton from '../TakeSnapshotButton'
import SnapshotRestore from '../SnapshotRestore'

import { createSnapshotRepositoryUrl } from '../../../../lib/urlBuilder'
import schedule from '../../../../lib/schedule'
import Permission from '../../../../lib/api/v1/permissions'

import { RepositoryConfig } from '../../../../lib/api/v1/types'
import {
  AsyncRequestState,
  ElasticsearchCluster,
  RegionId,
  StackDeployment,
} from '../../../../types'

type Props = {
  deployment: ElasticsearchCluster
  stackDeployment: StackDeployment
  snapshotRepositories?: { [repoId: string]: RepositoryConfig }
  fetchSnapshotRepositoriesRequest: AsyncRequestState
  setSnapshotRepositoryRequest: AsyncRequestState
  disableSnapshotsForClusterRequest: AsyncRequestState
  executeSlmPolicyRequest: AsyncRequestState
  deploymentId: string
  regionId: RegionId
  snapshotsEnabled: boolean
  showTakeSnapshotButton: boolean
  showRestoreSnapshotButton: boolean
  canManageRepos: boolean
  resetExecuteSlmPolicyRequest: (regionId: RegionId, deploymentId: string) => void
  setSnapshotRepository: (cluster: ElasticsearchCluster, snapshotRepositoryId: string) => void
  resetSetSnapshotRepositoryRequest: (regionId: RegionId, clusterId: string) => void
  disableSnapshotsForCluster: (cluster: ElasticsearchCluster) => void
  resetDisableSnapshotsForClusterRequest: (regionId: RegionId, clusterId: string) => void
  fetchSnapshotRepositories: (regionId: RegionId) => void
  fetchDeployment: (params: { deploymentId: string }) => void
}

type State = {
  snapshotRepositoryId: string
}

class SnapshotActions extends Component<Props, State> {
  state: State = {
    snapshotRepositoryId: this.getCurrentSnapshotRepoId(),
  }

  componentWillUnmount() {
    const {
      deployment: { id, regionId },
      resetSetSnapshotRepositoryRequest,
      resetDisableSnapshotsForClusterRequest,
    } = this.props

    resetSetSnapshotRepositoryRequest(regionId, id)
    resetDisableSnapshotsForClusterRequest(regionId, id)
  }

  render() {
    const { canManageRepos } = this.props

    return (
      <div data-test-id='slm-snapshot-actions-container'>
        {this.showActions() && this.renderActions()}
        {canManageRepos && this.renderSnapshotRepoEditor()}
      </div>
    )
  }

  renderActions() {
    const {
      executeSlmPolicyRequest,
      showTakeSnapshotButton,
      showRestoreSnapshotButton,
      disableSnapshotsForClusterRequest,
      stackDeployment,
    } = this.props

    return (
      <Fragment>
        <EuiFlexGroup gutterSize='m'>
          {showTakeSnapshotButton && (
            <EuiFlexItem grow={false}>
              <ClusterLockingGate>
                <TakeSnapshotButton deployment={stackDeployment} />
              </ClusterLockingGate>
            </EuiFlexItem>
          )}

          {showRestoreSnapshotButton && (
            <EuiFlexItem grow={false}>
              <ClusterLockingGate>
                <SnapshotRestore deployment={stackDeployment} />
              </ClusterLockingGate>
            </EuiFlexItem>
          )}

          <EuiFlexItem grow={false}>
            <ClusterLockingGate>
              {this.showDisableSnapshotsButton() && (
                <CuiPermissibleControl permissions={Permission.updateEsClusterMetadataSettings}>
                  <DangerButton
                    data-test-id='disable-snapshots-for-deployment'
                    onConfirm={() => this.disableSnapshotsForCluster()}
                    isBusy={disableSnapshotsForClusterRequest.inProgress}
                    fill={false}
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
              )}
            </ClusterLockingGate>
          </EuiFlexItem>
        </EuiFlexGroup>

        {executeSlmPolicyRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='error'>{executeSlmPolicyRequest.error}</CuiAlert>
          </Fragment>
        )}

        {executeSlmPolicyRequest.isDone && !executeSlmPolicyRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <EuiCallOut
              title={
                <FormattedMessage
                  id='take-snapshot-request-success'
                  defaultMessage='Snapshot in progress. Refresh the page to view status.'
                />
              }
            />
          </Fragment>
        )}
        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderSnapshotRepoEditor() {
    const {
      deployment,
      snapshotRepositories,
      setSnapshotRepositoryRequest,
      fetchSnapshotRepositoriesRequest,
      disableSnapshotsForClusterRequest,
    } = this.props

    if (fetchSnapshotRepositoriesRequest.error) {
      return (
        <CuiAlert type='error' data-test-id='repositories-request-error'>
          {fetchSnapshotRepositoriesRequest.error}
        </CuiAlert>
      )
    }

    if (!snapshotRepositories) {
      return <EuiLoadingSpinner data-test-id='repositories-loading-spinner' />
    }

    const { snapshotRepositoryId } = this.state
    const enabledSnapshots = this.hasEnabledSnapshots()
    const noSnapshotRepositoriesDefined = isEmpty(snapshotRepositories)
    const hasChangedSnapshotRepo = this.hasChangedSnapshotRepo()

    if (noSnapshotRepositoriesDefined) {
      return (
        <Fragment>
          <CuiAlert iconType='faceSad' type='warning' data-test-id='no-repositories-defined-alert'>
            <FormattedMessage
              id='cluster-manage-update-snapshot-repository.no-repos'
              defaultMessage='You do not have any snapshot repositories set up. {addLink} to enable snapshots for your Elasticsearch clusters.'
              values={{
                addLink: (
                  <CuiPermissibleControl permissions={Permission.setSnapshotRepository}>
                    <Link to={createSnapshotRepositoryUrl(deployment.regionId)}>
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
                  ...map(snapshotRepositories, (repo) => {
                    const { type } = repo.config as { type?: string }
                    return {
                      value: repo.repository_name,
                      text: type ? `${repo.repository_name} (${type})` : repo.repository_name,
                    }
                  }),
                ]}
              />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiFlexGroup gutterSize='s'>
                {(hasChangedSnapshotRepo || !enabledSnapshots) && (
                  <EuiFlexItem grow={false}>
                    <CuiPermissibleControl permissions={Permission.updateEsClusterMetadataSettings}>
                      <SpinButton
                        data-test-id='save-snapshot-repo-button'
                        fill={true}
                        onClick={() => this.setSnapshotRepository()}
                        spin={setSnapshotRepositoryRequest.inProgress}
                        requiresSudo={true}
                      >
                        <FormattedMessage
                          id='cluster-manage-update-snapshot-repository.save-repository'
                          defaultMessage='Save'
                        />
                      </SpinButton>
                    </CuiPermissibleControl>
                  </EuiFlexItem>
                )}
                {hasChangedSnapshotRepo && (
                  <EuiFlexItem grow={false}>
                    <EuiButton
                      data-test-id='reset-snapshot-repo-button'
                      onClick={() => this.resetSnapshotRepo()}
                    >
                      <FormattedMessage
                        id='cluster-manage-update-snapshot-repository.reset-repository'
                        defaultMessage='Cancel'
                      />
                    </EuiButton>
                  </EuiFlexItem>
                )}
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFormRow>

        {setSnapshotRepositoryRequest.error && (
          <CuiAlert type='error' className='updateSnapshotRepository-error'>
            {setSnapshotRepositoryRequest.error}
          </CuiAlert>
        )}

        {setSnapshotRepositoryRequest.isDone && (
          <CuiAlert
            type='info'
            className='updateSnapshotRepository-success'
            data-test-id='update-snapshot-repository-success'
          >
            <FormattedMessage
              id='cluster-manage-update-snapshot-repository.success-message'
              defaultMessage='This Elasticsearch cluster will now use the chosen snapshot repository.'
            />
          </CuiAlert>
        )}

        {disableSnapshotsForClusterRequest.error && (
          <CuiAlert type='error' className='updateSnapshotRepository-error'>
            {disableSnapshotsForClusterRequest.error}
          </CuiAlert>
        )}

        {disableSnapshotsForClusterRequest.isDone && (
          <CuiAlert
            type='info'
            className='updateSnapshotRepository-success disabledSnapshots'
            data-test-id='snapshots-disabled-alert'
          >
            <FormattedMessage
              id='cluster-manage-disable-snapshot-repository.success-message'
              defaultMessage='This Elasticsearch cluster now has snapshots disabled.'
            />
          </CuiAlert>
        )}
      </Fragment>
    )
  }

  getCurrentSnapshotRepoId() {
    return this.props.deployment.snapshots.snapshotRepositoryId || ``
  }

  hasChangedSnapshotRepo() {
    return this.getCurrentSnapshotRepoId() !== this.state.snapshotRepositoryId
  }

  resetSnapshotRepo() {
    this.setState({ snapshotRepositoryId: this.getCurrentSnapshotRepoId() })
  }

  hasEnabledSnapshots() {
    const { deployment } = this.props
    return deployment.snapshots.enabled
  }

  showDisableSnapshotsButton() {
    return this.props.canManageRepos && this.hasEnabledSnapshots()
  }

  showActions() {
    const { showTakeSnapshotButton, showRestoreSnapshotButton } = this.props
    return showTakeSnapshotButton || showRestoreSnapshotButton || this.showDisableSnapshotsButton()
  }

  disableSnapshotsForCluster() {
    const { deployment, disableSnapshotsForCluster } = this.props
    disableSnapshotsForCluster(deployment)
  }

  setSnapshotRepository() {
    const { snapshotRepositoryId } = this.state
    const { deployment, setSnapshotRepository } = this.props
    setSnapshotRepository(deployment, snapshotRepositoryId)
  }
}

export default schedule(
  SnapshotActions,
  ({ deployment, fetchSnapshotRepositories, fetchDeployment }: Props) => {
    fetchSnapshotRepositories(deployment.regionId)
    fetchDeployment({ deploymentId: deployment.stackDeploymentId! })
  },
  [[`deployment`, `regionId`]],
)
