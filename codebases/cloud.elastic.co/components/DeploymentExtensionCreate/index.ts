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

import { withTransaction } from '@elastic/apm-rum-react'

import DeploymentExtensionCreate from './DeploymentExtensionCreate'

import {
  createExtension,
  uploadExtension,
  resetCreateExtensionRequest,
  resetUploadExtensionRequest,
} from '../../actions/deploymentExtensions'
import { push } from '../../actions/history'

import { createDeploymentExtensionRequest, uploadDeploymentExtensionRequest } from '../../reducers'
import { getProfile } from '../../apps/userconsole/reducers'

import { deploymentExtensionsUrl } from '../../lib/urlBuilder'

import { AsyncRequestState } from '../../types'
import { CreateExtensionRequest } from '../../lib/api/v1/types'

type StateProps = {
  canEditPlugins: boolean
  canEditBundles: boolean
  createExtensionRequest: AsyncRequestState
  uploadExtensionRequest: (extensionId: string) => AsyncRequestState
}

type DispatchProps = {
  createExtension: (params: { extension: CreateExtensionRequest }) => Promise<any>
  uploadExtension: (params: { extensionId: string; file: File }) => Promise<any>
  redirectToList: () => void
  resetCreateExtension: () => void
  resetUploadExtension: (extensionId: string) => void
}

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => {
  const profile = getProfile(state)

  return {
    createExtensionRequest: createDeploymentExtensionRequest(state),
    uploadExtensionRequest: (extensionId) => uploadDeploymentExtensionRequest(state, extensionId),
    canEditPlugins: Boolean(profile && profile.allow_plugins),
    canEditBundles: Boolean(profile && profile.allow_bundles),
  }
}

const mapDispatchToProps = (dispatch): DispatchProps => ({
  createExtension: (params: { extension: CreateExtensionRequest }) =>
    dispatch(createExtension(params)),
  uploadExtension: (params: { extensionId: string; file: File }) =>
    dispatch(uploadExtension(params)),
  redirectToList: () => dispatch(push(deploymentExtensionsUrl())),
  resetCreateExtension: () => dispatch(resetCreateExtensionRequest()),
  resetUploadExtension: (extensionId: string) => dispatch(resetUploadExtensionRequest(extensionId)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withTransaction(`Create extension`, `component`)(DeploymentExtensionCreate))
