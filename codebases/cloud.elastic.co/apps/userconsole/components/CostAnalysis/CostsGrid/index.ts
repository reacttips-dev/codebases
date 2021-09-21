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
import CostsGrid from './CostsGrid'

import { fetchDeploymentCostItemsRequest, getDeploymentItemsCosts } from '../../../reducers'
import {
  fetchDeploymentCostItems,
  resetFetchDeploymentCostItemsRequest,
} from '../../../actions/account'

import { AsyncRequestState, ThunkDispatch, AccountCostTimePeriod } from '../../../../../types'
import { ItemsCosts } from '../../../../../lib/api/v1/types'

interface StateProps {
  deploymentItemsCosts: ItemsCosts
  fetchDeploymentCostItemsRequest: AsyncRequestState
}

interface DispatchProps {
  fetchDeploymentCostItems: ({
    organizationId,
    timePeriod,
  }: {
    organizationId: string
    timePeriod: AccountCostTimePeriod
  }) => Promise<any>
  resetFetchDeploymentCostItemsRequest: () => void
}

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => ({
  deploymentItemsCosts: getDeploymentItemsCosts(state),
  fetchDeploymentCostItemsRequest: fetchDeploymentCostItemsRequest(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  fetchDeploymentCostItems: ({ organizationId, timePeriod }) =>
    dispatch(
      fetchDeploymentCostItems({
        organizationId,
        timePeriod,
      }),
    ),
  resetFetchDeploymentCostItemsRequest: () => dispatch(resetFetchDeploymentCostItemsRequest()),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(CostsGrid)
