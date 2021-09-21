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

import React, { Component, Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { capitalize, isEmpty } from 'lodash'
import moment from 'moment'

import {
  EuiCode,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiFormLabel,
  EuiLink,
  EuiLoadingSpinner,
  EuiPanel,
  EuiSpacer,

  // @ts-ignore shut up, TS
  EuiStat,
  EuiTextColor,
} from '@elastic/eui'

import { CuiAlert, CuiTimeAgo } from '../../../../cui'

import SnapshotHealth from '../SnapshotHealth'
import SnapshotInProgress from '../SnapshotInProgress'

import SnapshotIndices from './SnapshotIndices'

import RequiresSudo from '../../../RequiresSudo'
import PrivacySensitiveContainer from '../../../PrivacySensitiveContainer'

import prettyTime from '../../../../lib/prettyTime'

import {
  ClusterSnapshot,
  ClusterSnapshotStatus,
  AsyncRequestState,
  ElasticsearchCluster,
} from '../../../../types'

type Props = {
  cluster: ElasticsearchCluster
  fetchSnapshots: (cluster: ElasticsearchCluster) => void
  fetchSnapshotsRequest: AsyncRequestState
  snapshot: ClusterSnapshot | null
  snapshotStatus: ClusterSnapshotStatus | null
  isInProgress: boolean
}

const FailedShards = ({ failures }) => (
  <PrivacySensitiveContainer>
    {failures.map((failure) => (
      <div key={`${failure.index}.${failure.shard_id}`}>
        <FormattedMessage
          id='cluster-snapshots-details.shard-named'
          defaultMessage='Shard {shard} of {index} index'
          values={{
            shard: failure.shard_id,
            index: <EuiCode>{failure.index}</EuiCode>,
          }}
        />

        <EuiFormHelpText className='euiFormHelpText-zeroPad'>
          {capitalize(failure.reason)}
        </EuiFormHelpText>

        <EuiSpacer size='m' />
      </div>
    ))}
  </PrivacySensitiveContainer>
)

const SnapshotDetailsList: FunctionComponent<Props> = ({
  cluster,
  fetchSnapshots,
  fetchSnapshotsRequest,
  snapshot,
  snapshotStatus,
  isInProgress,
}) => (
  <div data-test-id='cluster-snapshot-details-list'>
    <RequiresSudo
      color='primary'
      buttonType={EuiLink}
      to={
        <FormattedMessage
          id='cluster-snapshot-details.reveal-snapshot-details'
          defaultMessage='Reveal snapshot details'
        />
      }
      helpText={false}
      actionPrefix={false}
    >
      <SnapshotDetailContents
        cluster={cluster}
        fetchSnapshots={fetchSnapshots}
        fetchSnapshotsRequest={fetchSnapshotsRequest}
        snapshot={snapshot}
        snapshotStatus={snapshotStatus}
        isInProgress={isInProgress}
      />
    </RequiresSudo>
  </div>
)

class SnapshotDetailContents extends Component<Props> {
  componentDidMount() {
    const { fetchSnapshots, cluster } = this.props
    fetchSnapshots(cluster)
  }

  render() {
    const { cluster, fetchSnapshotsRequest, snapshot, snapshotStatus, isInProgress } = this.props

    if (fetchSnapshotsRequest.error) {
      return <CuiAlert type='error'>{fetchSnapshotsRequest.error}</CuiAlert>
    }

    if (snapshotStatus && isInProgress) {
      return <SnapshotInProgress cluster={cluster} snapshotName={snapshotStatus.snapshot} />
    }

    if (snapshot == null) {
      return (
        <EuiFlexGroup gutterSize='m' alignItems='center'>
          <EuiFlexItem grow={false}>
            <FormattedMessage
              id='cluster-snapshot-details.loading-snapshot'
              defaultMessage='Loading snapshot'
            />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiLoadingSpinner size='m' />
          </EuiFlexItem>
        </EuiFlexGroup>
      )
    }

    const state = snapshotStatus ? snapshotStatus.state : snapshot.state

    return (
      <Fragment>
        <EuiPanel>
          <EuiFlexGroup justifyContent='spaceBetween'>
            <EuiFlexItem grow={false}>
              <EuiFormLabel>
                <FormattedMessage id='cluster-snapshots-details.result' defaultMessage='Result' />
              </EuiFormLabel>

              <div>
                <SnapshotHealth state={state} />
              </div>
            </EuiFlexItem>

            {snapshot.start_time ? (
              <EuiFlexItem grow={false}>
                <EuiFormLabel>
                  <FormattedMessage
                    id='cluster-snapshots-details.started'
                    defaultMessage='Started'
                  />
                </EuiFormLabel>

                <div>
                  <CuiTimeAgo date={moment(snapshot.start_time)} longTime={true} />
                </div>
              </EuiFlexItem>
            ) : null}

            {snapshot.end_time ? (
              <EuiFlexItem grow={false}>
                <EuiFormLabel>
                  <FormattedMessage
                    id='cluster-snapshots-details.completed'
                    defaultMessage='Completed'
                  />
                </EuiFormLabel>

                <div>
                  <CuiTimeAgo date={moment(snapshot.end_time)} longTime={true} />
                </div>
              </EuiFlexItem>
            ) : null}

            <EuiFlexItem grow={false}>
              <EuiFormLabel>
                <FormattedMessage
                  id='cluster-snapshots-details.duration'
                  defaultMessage='Duration'
                />
              </EuiFormLabel>

              <div>{prettyTime(snapshot.duration_in_millis)}</div>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>

        <EuiSpacer />

        <EuiFlexGroup justifyContent='spaceBetween'>
          <EuiFlexItem grow={false}>
            <EuiStat
              title={String(snapshot.shards.total)}
              titleSize='m'
              description={
                <FormattedMessage
                  id='cluster-snapshots-details.total-shards'
                  defaultMessage='Total shards'
                />
              }
              textAlign='right'
            />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiStat
              title={String(snapshot.shards.successful || 0)}
              titleSize='m'
              description={
                <FormattedMessage
                  id='cluster-snapshots-details.successful-shards'
                  defaultMessage='Successful shards'
                />
              }
              textAlign='right'
            />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiStat
              title={String(snapshot.shards.failed || 0)}
              titleSize='m'
              titleColor={snapshot.shards.failed > 0 ? `danger` : undefined}
              description={
                <FormattedMessage
                  id='cluster-snapshots-details.failed-shards'
                  defaultMessage='Failed shards'
                />
              }
              textAlign='right'
            />
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer />

        <EuiFlexGroup direction='column'>
          <EuiFlexItem grow={false}>
            <EuiFormLabel>
              <FormattedMessage id='cluster-snapshots-details.uuid' defaultMessage='UUID' />
            </EuiFormLabel>

            <div>
              <EuiCode>{snapshot.uuid}</EuiCode>
            </div>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiFormLabel>
              <FormattedMessage id='cluster-snapshots-details.version' defaultMessage='Version' />
            </EuiFormLabel>

            <div>{snapshot.version}</div>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiFormLabel>
              <FormattedMessage id='cluster-snapshots-details.indices' defaultMessage='Indices' />
            </EuiFormLabel>

            <EuiSpacer size='xs' />

            <div>
              <PrivacySensitiveContainer>
                <SnapshotIndices indices={snapshot.indices} limit={20} />
              </PrivacySensitiveContainer>
            </div>
          </EuiFlexItem>

          {isEmpty(snapshot.failures) ? null : (
            <EuiFlexItem grow={false}>
              <EuiTextColor color='danger'>
                <EuiFormLabel>
                  <FormattedMessage
                    id='cluster-snapshots-details.failures'
                    defaultMessage='Failed shards'
                  />
                </EuiFormLabel>
              </EuiTextColor>

              <EuiSpacer size='s' />

              <FailedShards failures={snapshot.failures} />
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </Fragment>
    )
  }
}

export default SnapshotDetailsList
