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
import DeploymentCostDetails from './DeploymentCostDetails'

import {
  fetchDeploymentCostItemsByDeploymentRequest,
  getDeploymentItemsCostsByDeployment,
} from '../../../reducers'
import { fetchDeploymentCostItemsByDeployment } from '../../../actions/account'

import {
  AsyncRequestState,
  ThunkDispatch,
  AccountCostTimePeriod,
  TimePeriod,
} from '../../../../../types'
import { ItemsCosts } from '../../../../../lib/api/v1/types'

interface StateProps {
  deploymentItemsCostsByDeployment: ItemsCosts
  fetchDeploymentCostItemsByDeploymentRequest: AsyncRequestState
}

interface DispatchProps {
  fetchDeploymentCostItemsByDeployment: (args: {
    timePeriod: AccountCostTimePeriod
    deploymentId: string
    organizationId: string
  }) => Promise<any>
}

interface ConsumerProps {
  timePeriod?: TimePeriod
}

const mapStateToProps = (state): StateProps => ({
  deploymentItemsCostsByDeployment: getDeploymentItemsCostsByDeployment(state),
  fetchDeploymentCostItemsByDeploymentRequest: fetchDeploymentCostItemsByDeploymentRequest(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  fetchDeploymentCostItemsByDeployment: (args: {
    timePeriod: AccountCostTimePeriod
    deploymentId: string
    organizationId: string
  }) => dispatch(fetchDeploymentCostItemsByDeployment(args)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DeploymentCostDetails)
