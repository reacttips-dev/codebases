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

import StackElasticCredentials from './StackElasticCredentials'

import { getStackDeploymentCreateResponse, getClusterCredentials } from '../../reducers'

import { getEsCredentialsFromCreateResponse } from '../../lib/stackDeployments/credentials'
import { getFirstEsClusterFromGet } from '../../lib/stackDeployments'

import { StackDeployment, NewDeploymentCredentials } from '../../types'

type StateProps = {
  credentials: NewDeploymentCredentials | null
}

interface DispatchProps {}

type ConsumerProps = {
  deployment: StackDeployment
}

const mapStateToProps = (state, { deployment }: ConsumerProps): StateProps => {
  // If a createResponse exists, that means the deployment is being created, and the credentials
  // are in the response
  const createResponse = getStackDeploymentCreateResponse(state, deployment.id)
  const credentialsFromCreate = getEsCredentialsFromCreateResponse({ createResponse })

  // Otherwise, credentials are saved in state with the associated ES cluster
  const { id } = deployment
  const esCluster = getFirstEsClusterFromGet({ deployment })
  const refId = esCluster ? esCluster.ref_id : null
  const credentialsFromState = refId ? getClusterCredentials(state, id, refId) : null

  return {
    credentials: credentialsFromCreate || credentialsFromState,
  }
}

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(StackElasticCredentials)
