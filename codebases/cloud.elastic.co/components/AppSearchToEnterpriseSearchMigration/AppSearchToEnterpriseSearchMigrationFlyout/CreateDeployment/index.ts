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

import CreateDeployment from './CreateDeployment'

import { createDeployment } from '../../../../actions/stackDeployments/crud'
import { fetchRegion } from '../../../../actions/regions'
import { fetchVersions } from '../../../../actions/elasticStack'
import { fetchDeploymentTemplates } from '../../../../actions/topology/deploymentTemplates'

import {
  getDeploymentTemplates,
  getVersionStacks,
  createStackDeploymentRequest,
  fetchRegionRequest,
  fetchVersionsRequest,
  getAppSearchToEnterpriseSearchMigrationProgress,
  fetchDeploymentTemplatesRequest,
  getRegion,
} from '../../../../reducers'
import { getCompatibleDeploymentTemplates, getRegionId } from '../../../../lib/stackDeployments'
import { getPreferredMigrationDestinationVersion } from '../../../../lib/stackDeployments/migrationsToEnterpriseSearch'

import { ReduxState, ThunkDispatch } from '../../../../types'
import { StateProps, DispatchProps, ConsumerProps } from './types'

const mapStateToProps: (state: ReduxState, consumerProps: ConsumerProps) => StateProps = (
  state,
  { sourceDeployment },
) => {
  const regionId = getRegionId({ deployment: sourceDeployment })!
  const stackVersions = getVersionStacks(state, regionId)

  const targetVersion = getPreferredMigrationDestinationVersion(stackVersions)

  const deploymentTemplates = getDeploymentTemplates(state, regionId, targetVersion)

  const eligibleDeploymentTemplates = getCompatibleDeploymentTemplates({
    deployment: sourceDeployment,
    deploymentTemplates,
  })

  const progress = getAppSearchToEnterpriseSearchMigrationProgress(state, sourceDeployment.id)!
  const sourceSnapshotName = progress.snapshotToWatch!

  return {
    regionId,
    region: getRegion(state, regionId),
    targetVersion,
    stackVersions,
    createDeploymentRequest: createStackDeploymentRequest(state),
    fetchRegionRequest: fetchRegionRequest(state, regionId),
    fetchVersionsRequest: fetchVersionsRequest(state),
    fetchDeploymentTemplatesRequest: fetchDeploymentTemplatesRequest(
      state,
      regionId,
      targetVersion,
    ),
    sourceSnapshotName,
    deploymentTemplates,
    eligibleDeploymentTemplates,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  createDeployment: (params) => dispatch(createDeployment(params)),
  fetchRegion: () => dispatch(fetchRegion()),
  fetchVersions: (regionId) => dispatch(fetchVersions(regionId)),
  fetchDeploymentTemplates: (params) => dispatch(fetchDeploymentTemplates(params)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateDeployment)
