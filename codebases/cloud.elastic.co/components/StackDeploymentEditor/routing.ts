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

import { ComponentClass } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { getStackDeployment } from '../../reducers'

import { withGlobalRouter } from '../../lib/router'

import { getRegionId } from '../../lib/stackDeployments'

type StateProps = {
  regionId: string

  // legacy deployment ID, but in reality this is just the ES cluster ID
  deploymentId: string | null

  // actual deployment ID
  stackDeploymentId: string | null
}

interface DispatchProps {}

interface ConsumerProps {}

type RouteParams = {
  regionId: string
  deploymentId: string
}

type ReceivedProps = ConsumerProps & RouteComponentProps<RouteParams>

export type WithStackDeploymentRouteParamsProps = StateProps & DispatchProps & ReceivedProps

/* Under the old API mode, we used the Clusters APIs and /:deploymentId refers to the ES cluster ID
 * In Stack Deployments mode, we use the Deployments API and /:deploymentId refers to the deployment ID
 * This HOC was introduced to make it easy for any top level route to deal with the migration.
 */
const mapStateToProps = (
  state,
  {
    match: {
      params: { regionId: routeRegionId, deploymentId },
    },
  }: ReceivedProps,
): StateProps => {
  const stackDeployment = getStackDeployment(state, deploymentId)

  if (!stackDeployment) {
    return {
      regionId: routeRegionId,
      deploymentId: null,
      stackDeploymentId: deploymentId,
    }
  }

  const regionId = getRegionId({ deployment: stackDeployment })!
  const esClusterId = stackDeployment.resources.elasticsearch[0].id

  return {
    regionId,
    deploymentId: esClusterId,
    stackDeploymentId: deploymentId,
  }
}

// withRouter call is necessary for cases where this isn't used on a top-level router
export function withStackDeploymentRouteParams<TProps>(wrappedComponent): ComponentClass<TProps> {
  return withGlobalRouter(
    connect<StateProps, DispatchProps, ReceivedProps>(mapStateToProps)(wrappedComponent),
  ) as unknown as ComponentClass<TProps>
}
