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

import TakeSnapshotButton from './TakeSnapshotButton'

import { executeSlmPolicyRequest, takeSnapshotRequest } from '../../../../reducers'

import { ReduxState } from '../../../../types'
import { StateProps, DispatchProps, ConsumerProps } from './types'
import { getFirstEsClusterFromGet, hasSlm } from '../../../../lib/stackDeployments'
import {
  takeSnapshot,
  resetExecuteSlmPolicyRequest,
  resetTakeSnapshotRequest,
  executeSlmPolicy,
} from '../../../../actions/snapshots'

const mapStateToProps: (state: ReduxState, consumerProps: ConsumerProps) => StateProps = (
  state,
  { deployment },
) => {
  const esResource = getFirstEsClusterFromGet({ deployment })!
  const { region: regionId, id: clusterId } = esResource
  const useSlm = hasSlm({ resource: esResource })

  return {
    takeSnapshotRequest: useSlm
      ? executeSlmPolicyRequest(state, clusterId, regionId)
      : takeSnapshotRequest(state, regionId, clusterId),
  }
}

const mapDispatchToProps = (dispatch, { deployment }): DispatchProps => {
  const esResource = getFirstEsClusterFromGet({ deployment })!
  const { region: regionId, id: clusterId } = esResource
  const useSlm = hasSlm({ resource: esResource })

  return {
    takeSnapshot: () => dispatch(useSlm ? executeSlmPolicy(esResource) : takeSnapshot(esResource)),
    resetTakeSnapshotRequest: () =>
      dispatch(
        useSlm
          ? resetExecuteSlmPolicyRequest(regionId, clusterId)
          : resetTakeSnapshotRequest(regionId, clusterId),
      ),
  }
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(TakeSnapshotButton)
