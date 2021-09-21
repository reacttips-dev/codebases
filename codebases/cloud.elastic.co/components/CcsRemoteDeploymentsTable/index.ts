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

import CcsRemoteDeploymentsTable from './CcsRemoteDeploymentsTable'

import { searchDeployments } from '../../actions/stackDeployments/crud'

import { getStackDeploymentsFromSearch, searchStackDeploymentsRequest } from '../../reducers'

import { getDeploymentsByIdQuery } from '../../lib/deploymentQuery'

import { ReduxState, ThunkDispatch } from '../../types'

import { StateProps, DispatchProps, ConsumerProps } from './types'

const queryId = `search-remote-deployments-by-cluster-ids`

const mapStateToProps = (state: ReduxState): StateProps => ({
  ccsDeployments: getStackDeploymentsFromSearch(state, queryId)?.deployments || [],
  ccsDeploymentsRequest: searchStackDeploymentsRequest(state, queryId),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  searchCcsDeployments: (deploymentIds) => {
    const query = getDeploymentsByIdQuery({ deploymentIds })
    const action = searchDeployments({ queryId, query })

    return dispatch(action)
  },
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(CcsRemoteDeploymentsTable)
