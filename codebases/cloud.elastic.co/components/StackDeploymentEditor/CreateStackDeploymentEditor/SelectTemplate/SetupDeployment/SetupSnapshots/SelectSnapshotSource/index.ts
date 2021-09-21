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

import SelectSnapshotSource from './SelectSnapshotSource'

import { fetchSnapshots } from '../../../../../../../actions/snapshots'
import { searchClusters } from '../../../../../../../actions/searchClusters'

import {
  fetchSnapshotsRequest,
  getClusterSnapshots,
  getSearchClustersById,
  searchClusterRequest,
} from '../../../../../../../reducers'

import {
  AsyncRequestState,
  ElasticsearchCluster,
  RegionId,
  RestoreSnapshot,
  VersionNumber,
  ClusterSnapshot,
  RestorePayload,
} from '../../../../../../../types'

import { SearchRequest } from '../../../../../../../lib/api/v1/types'

const searchId = `search-clusters-restore`

type ClusterSearchResults = {
  totalCount: number
  record: ElasticsearchCluster[]
}

type StateProps = {
  clusterSearchResults?: ClusterSearchResults | null
  fetchSnapshotsRequest: (regionId: string, id: string) => AsyncRequestState
  getClusterSnapshots: (regionId: string, id: string) => ClusterSnapshot[] | null | undefined
  searchClusterRequest: AsyncRequestState
}

type DispatchProps = {
  fetchSnapshots: (cluster: ElasticsearchCluster) => void
  onSearch: (request: SearchRequest, regionId: RegionId) => void
}

export interface ConsumerProps {
  asRestoreForm?: boolean
  forceLastSnapshot: boolean
  onChange: (value?: ElasticsearchCluster | null) => void
  onRestoreSnapshot?: () => any
  onSelectSnapshot?: (snapshot: ClusterSnapshot | null, id: string) => void
  onUpdateIndexRestore?: (payload: RestorePayload) => void
  regionId: string | null
  restoreSnapshotRequest?: AsyncRequestState
  showRegion: boolean
  snapshotRestoreSettings: RestoreSnapshot | undefined
  version: VersionNumber
}

const mapStateToProps = (state): StateProps => ({
  clusterSearchResults: getSearchClustersById(state, searchId),
  fetchSnapshotsRequest: (regionId, id) => fetchSnapshotsRequest(state, regionId, id),
  getClusterSnapshots: (regionId, id) => getClusterSnapshots(state, regionId, id),
  searchClusterRequest: searchClusterRequest(state, searchId),
})

const mapDispatchToProps: DispatchProps = {
  fetchSnapshots,
  onSearch: (searchRequest: SearchRequest, regionId: string) =>
    searchClusters(searchId, searchRequest, regionId),
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SelectSnapshotSource)
