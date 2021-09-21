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

import DeploymentAlias from './DeploymentAlias'

import { fetchDeploymentAliasEditAccess } from '../../../actions/deploymentAlias'

import {
  deploymentAliasEditAccess,
  fetchDeploymentDomainAliasEditAccessRequest,
  updateDeploymentDomainAliasRequest,
} from '../../../reducers'

import { getConfigForKey } from '../../../selectors'

import { AsyncRequestState, ReduxState, StackDeployment } from '../../../types'

import { getRegionId } from '../../../lib/stackDeployments'

type StateProps = {
  deploymentAliasEditAccess: boolean
  fetchDeploymentDomainAliasEditAccessRequest: AsyncRequestState
  isEceAdminconsole: boolean
  regionId: string
  updateDeploymentAliasRequest: AsyncRequestState
}

type DispatchProps = {
  fetchDeploymentAliasEditAccess: (params: { regionId: string }) => Promise<any>
}

type ConsumerProps = {
  deployment: StackDeployment
}

const mapStateToProps = (state: ReduxState, { deployment }): StateProps => {
  const regionId = getRegionId({ deployment })!
  const isEceAdminconsole =
    getConfigForKey(state, `CLOUD_UI_APP`) === `cloud-enterprise-adminconsole`

  return {
    deploymentAliasEditAccess: deploymentAliasEditAccess(state),
    isEceAdminconsole,
    fetchDeploymentDomainAliasEditAccessRequest: fetchDeploymentDomainAliasEditAccessRequest(
      state,
      regionId,
    ),
    regionId,
    updateDeploymentAliasRequest: updateDeploymentDomainAliasRequest(state, deployment.id),
  }
}

const mapDispatchToProps = (dispatch): DispatchProps => ({
  fetchDeploymentAliasEditAccess: ({ regionId }: { regionId: string }) =>
    dispatch(fetchDeploymentAliasEditAccess({ regionId })),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DeploymentAlias)
