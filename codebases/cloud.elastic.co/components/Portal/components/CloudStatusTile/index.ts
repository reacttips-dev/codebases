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
import { AsyncRequestState, ThunkDispatch } from '../../../../types'
import { Summary } from '../../../../lib/api/v1/types'
import { fetchCloudStatus } from '../../../../actions/status'
import { fetchCloudStatusRequest, getCloudStatus } from '../../../../reducers'
import CloudStatusTile from './CloudStatusTile'

interface StateProps {
  fetchCloudStatusRequest: AsyncRequestState
  cloudStatus: Summary
}

interface DispatchProps {
  fetchCloudStatus: () => Promise<any>
}

const mapStateToProps = (state) => ({
  fetchCloudStatusRequest: fetchCloudStatusRequest(state),
  cloudStatus: getCloudStatus(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  fetchCloudStatus: () => dispatch(fetchCloudStatus()),
})

export default connect<StateProps, DispatchProps, unknown>(
  mapStateToProps,
  mapDispatchToProps,
)(CloudStatusTile)
