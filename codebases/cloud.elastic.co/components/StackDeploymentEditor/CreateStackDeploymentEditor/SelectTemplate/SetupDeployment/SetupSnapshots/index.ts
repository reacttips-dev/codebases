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

import SetupSnapshots from './SetupSnapshots'

import { isFeatureActivated } from '../../../../../../selectors'

import Feature from '../../../../../../lib/feature'

import {
  ClusterSnapshot,
  ElasticsearchCluster,
  StackDeploymentCreateRequest,
  RegionId,
  VersionNumber,
} from '../../../../../../types'

type StateProps = {
  hasDefaultSnapshotRepository: boolean
}

interface DispatchProps {}

type ConsumerProps = {
  editorState: StackDeploymentCreateRequest
  onChangeSnapshotSource: (source?: ElasticsearchCluster | null) => void
  onChangeSnapshot: (source?: ClusterSnapshot | null) => void
  regionId: RegionId
  showRegion: boolean
  version: VersionNumber
  disabled?: boolean
}

const mapStateToProps = (state): StateProps => ({
  hasDefaultSnapshotRepository: isFeatureActivated(state, Feature.defaultSnapshotRepository),
})

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SetupSnapshots)
