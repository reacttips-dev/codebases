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
import { isFeatureActivated } from '../../../../selectors'

import SnapshotActions from './SnapshotActions'

import { getCluster } from '../../../../reducers'
import { takeSnapshotRequest } from '../../../../reducers/asyncRequests/registry'
import { resetTakeSnapshotRequest } from '../../../../actions/snapshots'
import Feature from '../../../../lib/feature'

const mapStateToProps = (state, { regionId, deploymentId, snapshotsEnabled }) => {
  const deployment = getCluster(state, regionId, deploymentId)

  return {
    deployment,
    takeSnapshotRequest: takeSnapshotRequest(state, regionId, deploymentId),
    showTakeSnapshotButton:
      snapshotsEnabled && isFeatureActivated(state, Feature.showTakeSnapshotButton),
  }
}

export default connect(mapStateToProps, {
  resetTakeSnapshotRequest,
})(SnapshotActions)
