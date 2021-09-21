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

import CreateDeploymentButton from './CreateDeploymentButton'

import { redirectToStackGettingStarted } from '../../../../actions/clusters'

import { createDeployment, resetCreateDeployment } from '../../../../actions/stackDeployments'

import { createStackDeploymentRequest, getRegion, getVersionStacks } from '../../../../reducers'
import { getProfile } from '../../../../apps/userconsole/reducers'

import {
  AsyncRequestState,
  Region,
  StackDeploymentCreateRequest,
  RegionId,
  UserProfile,
} from '../../../../types'

import { DeploymentCreateRequest, StackVersionConfig } from '../../../../lib/api/v1/types'

type StateProps = {
  region?: Region
  profile?: UserProfile | null
  createStackDeploymentRequest: AsyncRequestState
  stackVersions?: StackVersionConfig[] | null
}

type DispatchProps = {
  createDeployment: (params: {
    deployment: DeploymentCreateRequest
    profile?: UserProfile | null
  }) => void
  resetCreateDeployment: (regionId: string) => void
  redirectToStackGettingStarted: (stackDeploymentId: string, regionId: RegionId) => void
}

type ConsumerProps = {
  editorState: StackDeploymentCreateRequest
  disabled?: boolean

  // `filterIngestPlugins` prop already existed, but it carries a bug: depending where we render the button, we might or not filter ingest plugins. this is bad. we need to kill it and look at (or maybe update) the editor state instead
  filterIngestPlugins?: boolean

  // `hasIndexCuration` prop already existed, but it carries a bug: depending where we render the button, we might or not consider we have index curation. this is bad. we need to kill it and look at the editor state instead
  hasIndexCuration?: boolean
}

const mapStateToProps = (state, { editorState }: ConsumerProps): StateProps => {
  const regionId = editorState.regionId!

  return {
    profile: getProfile(state),
    region: getRegion(state, regionId),
    createStackDeploymentRequest: createStackDeploymentRequest(state),
    stackVersions: getVersionStacks(state, regionId),
  }
}

const mapDispatchToProps: DispatchProps = {
  createDeployment,
  resetCreateDeployment,
  redirectToStackGettingStarted,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateDeploymentButton)
