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
import { get } from 'lodash'
import { withTransaction } from '@elastic/apm-rum-react'

import ClusterSnapshots, { StateProps, DispatchProps, ConsumerProps } from './ClusterSnapshots'

import { fetchSnapshotSettings } from '../../../actions/snapshotSettings'

import {
  getCluster,
  getSnapshotSettings,
  getClusterSnapshots,
  getStackDeployment,
  fetchSnapshotSettingsRequest,
} from '../../../reducers'

import { isFeatureActivated } from '../../../selectors'

import { getConfigForKey } from '../../../store'

import { withStackDeploymentRouteParams } from '../../StackDeploymentEditor'

import Feature from '../../../lib/feature'

import { ReduxState } from '../../../types'

const mapStateToProps = (
  state: ReduxState,
  { regionId, deploymentId, stackDeploymentId },
): StateProps => {
  const cluster = getCluster(state, regionId, deploymentId)
  const snapshotSettings = getSnapshotSettings(state, regionId, deploymentId)
  const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`
  const isHeroku = getConfigForKey(`APP_FAMILY`) === `heroku`

  return {
    snapshotSettingsEnabled: get(snapshotSettings, [`enabled`], true),
    cluster,
    snapshotSettings,
    stackDeployment: getStackDeployment(state, stackDeploymentId),
    fetchSnapshotSettingsRequest: fetchSnapshotSettingsRequest(state, regionId, deploymentId),
    snapshotHistory: getClusterSnapshots(state, regionId, deploymentId),
    hasDefaultSnapshotRepository: isFeatureActivated(state, Feature.defaultSnapshotRepository),
    isUserConsole,
    isHeroku,
  }
}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, ConsumerProps>(mapStateToProps, {
    fetchSnapshotSettings,
  })(withTransaction(`Elasticsearch snapshots`, `component`)(ClusterSnapshots)),
)
