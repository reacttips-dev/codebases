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

import ClusterLocking from './ClusterLocking'

import { setClusterLock } from '../../../actions/clusters'
import { resetCallStoredProcedureRequest } from '../../../actions/storedProcedures'

import { callStoredProcedureRequest } from '../../../reducers'

import { isFeatureActivated } from '../../../selectors'

import { ElasticsearchCluster } from '../../../types'
import Feature from '../../../lib/feature'

const mapStateToProps = (state, { cluster }) => ({
  isLocked: cluster.isLocked,
  setClusterLockRequest: callStoredProcedureRequest(state, `lock_cluster`),
  canToggleClusterLock: isFeatureActivated(state, Feature.toggleClusterLock),
})

export default connect(
  mapStateToProps,
  (
    dispatch,
    {
      cluster,
    }: {
      cluster: ElasticsearchCluster
    },
  ) => ({
    setClusterLock: (enabled) => dispatch(setClusterLock(cluster.regionId, cluster.id, enabled)),
    resetClusterLock: () => dispatch(resetCallStoredProcedureRequest(`lock_cluster`)),
  }),
)(ClusterLocking)
