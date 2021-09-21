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

import SnapshotRepository from './SnapshotRepository'

import { getSnapshotRepositories } from '../../../reducers'
import { RegionId } from '../../../types'
import { RepositoryConfig, DeploymentTemplateInfoV2 } from '../../../lib/api/v1/types'

interface StateProps {
  snapshotRepositories: { [repositoryName: string]: RepositoryConfig }
}

interface DispatchProps {}

interface ConsumerProps {
  regionId: RegionId
  deploymentTemplate?: DeploymentTemplateInfoV2 | null
  snapshotRepositoryId: string | null
  setSnapshotRepositoryId: (snapshotRepositoryId: string | null) => void
}

const mapStateToProps = (state, { regionId }) => ({
  snapshotRepositories: getSnapshotRepositories(state, regionId),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  {},
)(SnapshotRepository)
