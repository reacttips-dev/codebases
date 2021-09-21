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

import { filter, size, uniq } from 'lodash'
import React, { Component, Fragment, FunctionComponent, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiBadge,
  EuiErrorBoundary,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiSpacer,
  EuiTab,
  EuiTabs,
} from '@elastic/eui'

import { filterSearchableSnapshots } from '../../../../lib/stackDeployments/selectors'

import { CuiAlert } from '../../../../cui'

import SnapshotsTable from './SnapshotsTable'
import { SnapshotHealthText } from '../SnapshotHealth'

import { ClusterSnapshot, AsyncRequestState, ElasticsearchCluster } from '../../../../types'

type Props = {
  cluster: ElasticsearchCluster
  snapshots: ClusterSnapshot[] | null
  fetchSnapshotsRequest: AsyncRequestState
  readonly?: boolean
  fetchSnapshots: () => void
}

type StateTabProps = {
  state: string | null
  currentState: string | null
  children: ReactNode
  snapshots: ClusterSnapshot[]
  onChange: () => void
}

type State = {
  snapshotState: string | null
}

class SnapshotHistory extends Component<Props, State> {
  state: State = {
    snapshotState: null,
  }

  componentDidMount() {
    const { fetchSnapshots } = this.props
    fetchSnapshots()
  }

  render() {
    const { cluster, fetchSnapshotsRequest, readonly, snapshots } = this.props

    if (fetchSnapshotsRequest.error) {
      return <CuiAlert type='error'>{fetchSnapshotsRequest.error}</CuiAlert>
    }

    if (snapshots == null) {
      return (
        <EuiFlexGroup gutterSize='m' alignItems='center'>
          <EuiFlexItem grow={false}>
            <FormattedMessage
              id='cluster-snapshots.loading-snapshot-history'
              defaultMessage='Loading snapshot history'
            />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiLoadingSpinner size='m' />
          </EuiFlexItem>
        </EuiFlexGroup>
      )
    }

    if (snapshots.length === 0) {
      return (
        <FormattedMessage
          id='cluster-snapshots.no-snapshots-found'
          defaultMessage='No snapshots found'
        />
      )
    }

    const { snapshotState } = this.state
    const snapshotStates = uniq(snapshots.map((snapshot) => snapshot.state))

    let filteredSnapshots = this.getSnapshotsWhereState(snapshotState)

    if (cluster.settings.snapshot?.slm && filteredSnapshots) {
      filteredSnapshots = filterSearchableSnapshots(filteredSnapshots)
    }

    return (
      <Fragment>
        <EuiTabs>
          <SnapshotStateTab
            currentState={snapshotState}
            snapshots={this.getSnapshotsWhereState(null)}
            state={null}
            onChange={() => this.setState({ snapshotState: null })}
          >
            <FormattedMessage id='cluster-snapshots.all-snapshots' defaultMessage='All snapshots' />
          </SnapshotStateTab>

          {snapshotStates.map((state) => (
            <SnapshotStateTab
              key={state}
              currentState={snapshotState}
              snapshots={this.getSnapshotsWhereState(state)}
              state={state}
              onChange={() => this.setState({ snapshotState: state })}
            >
              <SnapshotHealthText state={state} />
            </SnapshotStateTab>
          ))}
        </EuiTabs>

        <EuiSpacer size='m' />

        <EuiErrorBoundary>
          <SnapshotsTable cluster={cluster} snapshots={filteredSnapshots} readonly={readonly} />
        </EuiErrorBoundary>
      </Fragment>
    )
  }

  getSnapshotsWhereState(state: string | null): ClusterSnapshot[] {
    const { snapshots } = this.props

    if (state === null) {
      return snapshots!
    }

    return filter(snapshots, { state })!
  }
}

const SnapshotStateTab: FunctionComponent<StateTabProps> = ({
  snapshots,
  currentState,
  state,
  children,
  onChange,
}) => (
  <EuiTab isSelected={currentState === state} onClick={onChange}>
    <EuiFlexGroup gutterSize='s' alignItems='center'>
      <EuiFlexItem grow={false}>{children}</EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiBadge color='hollow'>{size(snapshots)}</EuiBadge>
      </EuiFlexItem>
    </EuiFlexGroup>
  </EuiTab>
)

export default SnapshotHistory
