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
import SnapshotSettings from './SnapshotSettings'

import {
  fetchSnapshotSettings,
  setSnapshotSettings,
  updateSnapshotSettings,
} from '../../../../actions/snapshotSettings'

import {
  fetchSnapshotSettingsRequest,
  updateSnapshotSettingsRequest,
  getSnapshotSettings,
} from '../../../../reducers'
import { ElasticsearchCluster, ReduxState } from '../../../../types'

const mapStateToProps = (state: ReduxState, { cluster }: { cluster: ElasticsearchCluster }) => ({
  snapshotSettings: getSnapshotSettings(state, cluster.regionId, cluster.id),
  fetchSnapshotSettingsRequest: fetchSnapshotSettingsRequest(state, cluster.regionId, cluster.id),
  updateSnapshotSettingsRequest: updateSnapshotSettingsRequest(state, cluster.regionId, cluster.id),
})

export default connect(mapStateToProps, {
  fetchSnapshotSettings,
  setSnapshotSettings,
  updateSnapshotSettings,
})(SnapshotSettings)
