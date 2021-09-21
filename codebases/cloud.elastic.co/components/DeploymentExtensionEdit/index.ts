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

import { omit } from 'lodash'

import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'

import DeploymentExtensionEdit from './DeploymentExtensionEdit'

import {
  fetchExtension,
  updateExtension,
  uploadExtension,
  resetUpdateExtensionRequest,
  resetUploadExtensionRequest,
} from '../../actions/deploymentExtensions'

import {
  getDeploymentExtension,
  fetchDeploymentExtensionRequest,
  updateDeploymentExtensionRequest,
  uploadDeploymentExtensionRequest,
} from '../../reducers'

import { getProfile } from '../../apps/userconsole/reducers'

import { Extension, UpdateExtensionRequest } from '../../lib/api/v1/types'
import { AsyncRequestState } from '../../types'

type StateProps = {
  extension: Extension | null
  fetchExtensionRequest: AsyncRequestState
  updateExtensionRequest: AsyncRequestState
  uploadExtensionRequest: AsyncRequestState
  canEditPlugins: boolean
  canEditBundles: boolean
}

type DispatchProps = {
  fetchExtension: () => void
  updateExtension: (extension: UpdateExtensionRequest) => Promise<void>
  uploadExtension: (file: File) => Promise<void>
  resetUpdateExtension: () => void
  resetUploadExtension: () => void
}

type RouteParams = {
  extensionId: string
}

type ConsumerProps = RouteComponentProps<RouteParams> & unknown

const mapStateToProps = (
  state,
  {
    match: {
      params: { extensionId },
    },
  }: ConsumerProps,
): StateProps => {
  const profile = getProfile(state)
  const extension = getDeploymentExtension(state, extensionId)

  return {
    extension,
    fetchExtensionRequest: fetchDeploymentExtensionRequest(state, extensionId),
    updateExtensionRequest: updateDeploymentExtensionRequest(state, extensionId),
    uploadExtensionRequest: uploadDeploymentExtensionRequest(state, extensionId),
    canEditPlugins: Boolean(profile && profile.allow_plugins),
    canEditBundles: Boolean(profile && profile.allow_bundles),
  }
}

const mapDispatchToProps = (
  dispatch,
  {
    match: {
      params: { extensionId },
    },
  }: ConsumerProps,
): DispatchProps => ({
  fetchExtension: () => dispatch(fetchExtension({ extensionId })),
  updateExtension: (extension: Extension) =>
    dispatch(updateExtension({ extensionId, extension: omit(extension, [`id`]) })),
  uploadExtension: (file: File) => dispatch(uploadExtension({ extensionId, file })),
  resetUpdateExtension: () => dispatch(resetUpdateExtensionRequest(extensionId)),
  resetUploadExtension: () => dispatch(resetUploadExtensionRequest(extensionId)),
})

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(DeploymentExtensionEdit),
)
