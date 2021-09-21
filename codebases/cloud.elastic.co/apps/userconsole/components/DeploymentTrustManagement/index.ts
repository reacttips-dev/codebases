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

import DeploymentTrustManagement from './DeploymentTrustManagement'

import { fetchCurrentAccount, resetFetchCurrentAccount } from '../../../../actions/account'

import { searchDeployments } from '../../../../actions/stackDeployments'

import {
  getCurrentAccount,
  getStackDeploymentsFromSearch,
  searchStackDeploymentsRequest,
} from '../../../../reducers'

import { getDeploymentsByClusterIdsQuery } from '../../../../lib/deploymentQuery'

import { ReduxState, ThunkDispatch } from '../../../../types'

import { StateProps, DispatchProps } from './types'

const nonce = `trustAllowlistDeployments`

const mapStateToProps = (state: ReduxState): StateProps => ({
  allowlistDeployments: getStackDeploymentsFromSearch(state, nonce)?.deployments || [],
  allowlistDeploymentsRequest: searchStackDeploymentsRequest(state, nonce),
  currentAccount: getCurrentAccount(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  fetchCurrentAccount: () => dispatch(fetchCurrentAccount()),
  resetFetchCurrentAccount: () => dispatch(resetFetchCurrentAccount()),
  searchForAllowlistDeployments: (clusterIds) => {
    const query = getDeploymentsByClusterIdsQuery({ clusterIds })
    dispatch(searchDeployments({ queryId: nonce, query }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentTrustManagement)
