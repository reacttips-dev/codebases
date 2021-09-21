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

import { connect } from 'react-redux'

import SnapshotHistory from './SnapshotHistory'

import { fetchSnapshots } from '../../../../actions/snapshots/fetchSnapshots'

import { getClusterSnapshots } from '../../../../reducers'
import { fetchSnapshotsRequest } from '../../../../reducers/asyncRequests/registry'

import withPolling from '../../../../lib/withPolling'

const mapStateToProps = (state, { cluster: { regionId, id: clusterId } }) => ({
  snapshots: getClusterSnapshots(state, regionId, clusterId),
  fetchSnapshotsRequest: fetchSnapshotsRequest(state, regionId, clusterId),
})

const mapDispatchToProps = (dispatch, { cluster }) => ({
  fetchSnapshots: () => dispatch(fetchSnapshots(cluster)),
})

const PollingSnapshotHistory = withPolling(SnapshotHistory, ({ fetchSnapshots: onPoll }) => ({
  onPoll,
}))

export default connect(mapStateToProps, mapDispatchToProps)(PollingSnapshotHistory)
