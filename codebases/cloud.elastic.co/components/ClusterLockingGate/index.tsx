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

import { ComponentClass, ReactNode } from 'react'
import { connect } from 'react-redux'

import { getCluster } from '../../reducers'

import { getConfigForKey } from '../../selectors'

import ClusterLockingGate from './ClusterLockingGate'

import {
  withStackDeploymentRouteParams,
  WithStackDeploymentRouteParamsProps,
} from '../StackDeploymentEditor'

type StateProps = {
  isLocked: boolean
}

interface DispatchProps {}

type ConsumerProps = {
  onLocked?: () => ReactNode
}

type ConnectedProps = ConsumerProps & WithStackDeploymentRouteParamsProps

const mapStateToProps = (state, { regionId, deploymentId }: ConnectedProps): StateProps => {
  const uc = getConfigForKey(state, `APP_NAME`) === `userconsole`
  const cluster = deploymentId ? getCluster(state, regionId, deploymentId) : null

  /* [1]: if we can't get a `cluster`, we're likely to render spinners.
   *
   * even if a cluster is actually locked, it is only in
   * the userconsole that we honor that predicament.
   *
   */
  const isLocked = Boolean(
    cluster && // [1]
      cluster.isLocked &&
      uc, // [2]
  )

  return {
    isLocked,
  }
}

const mapDispatchToProps: DispatchProps = {}

// all the containers confuse the heck out of TS, so we need this intermediate step
const ClusterLockingGateImpl: ComponentClass<ConsumerProps> = withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(ClusterLockingGate),
)

export default ClusterLockingGateImpl
