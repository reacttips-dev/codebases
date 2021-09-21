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

import { fetchVersionsRequest } from '../../../../../../reducers'

import SelectVersion from './SelectVersion'

import {
  RegionId,
  VersionNumber,
  StackDeploymentCreateRequest,
  AsyncRequestState,
} from '../../../../../../types'

type StateProps = {
  fetchVersionsRequest: AsyncRequestState
}

interface DispatchProps {}

type ConsumerProps = {
  availableVersions: VersionNumber[]
  whitelistedVersions: VersionNumber[]
  setVersion: (version: VersionNumber) => void
  version: VersionNumber
  disabled?: boolean
  regionId: RegionId
  editorState: StackDeploymentCreateRequest
}

const mapStateToProps = (state, { regionId }: ConsumerProps): StateProps => ({
  fetchVersionsRequest: fetchVersionsRequest(state, regionId),
})

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SelectVersion)
