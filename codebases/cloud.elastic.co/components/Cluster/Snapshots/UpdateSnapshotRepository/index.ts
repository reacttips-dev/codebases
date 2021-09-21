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

import UpdateSnapshotRepository from './UpdateSnapshotRepository'

import {
  setSnapshotRepository,
  resetSetSnapshotRepositoryRequest,
  disableSnapshotsForCluster,
  resetDisableSnapshotsForClusterRequest,
} from '../../../../actions/clusters'

import { fetchSnapshotRepositories } from '../../../../actions/snapshotRepositories'

import {
  getSnapshotRepositories,
  fetchSnapshotRepositoriesRequest,
  setSnapshotRepositoryRequest,
  disableSnapshotsForClusterRequest,
} from '../../../../reducers'

const mapStateToProps = (state, { cluster }) => ({
  snapshotRepositories: getSnapshotRepositories(state, cluster.regionId),
  fetchSnapshotRepositoriesRequest: fetchSnapshotRepositoriesRequest(state, cluster.regionId),
  setSnapshotRepositoryRequest: setSnapshotRepositoryRequest(state, cluster.regionId, cluster.id),
  disableSnapshotsForClusterRequest: disableSnapshotsForClusterRequest(
    state,
    cluster.regionId,
    cluster.id,
  ),
})

export default connect(mapStateToProps, {
  fetchSnapshotRepositories,
  setSnapshotRepository,
  resetSetSnapshotRepositoryRequest,
  disableSnapshotsForCluster,
  resetDisableSnapshotsForClusterRequest,
})(UpdateSnapshotRepository)
