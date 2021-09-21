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

import DeploymentOperations from './DeploymentOperations'

import { getCluster } from '../../reducers'

import { isFeatureActivated } from '../../selectors'
import { withStackDeploymentRouteParams } from '../StackDeploymentEditor'

import Feature from '../../lib/feature'

const mapStateToProps = (state, { regionId, deploymentId }) => ({
  cluster: getCluster(state, regionId, deploymentId),
  tempShieldUsersActivated: isFeatureActivated(state, Feature.tempShieldUsers),
})

export default withStackDeploymentRouteParams(connect(mapStateToProps, {})(DeploymentOperations))
