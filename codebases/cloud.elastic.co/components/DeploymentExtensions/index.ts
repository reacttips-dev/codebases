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

import DeploymentExtensions from './DeploymentExtensions'

import { fetchExtensions, deleteExtension } from '../../actions/deploymentExtensions'

import {
  getDeploymentExtensions,
  fetchDeploymentExtensionsRequest,
  deleteDeploymentExtensionRequest,
} from '../../reducers'

import withLoading from '../../lib/apm/withLoading'

import { AsyncRequestState } from '../../types'
import { Extension } from '../../lib/api/v1/types'

type StateProps = {
  extensions: Extension[] | null
  fetchExtensionsRequest: AsyncRequestState
  deleteExtensionRequest: (extensionId: string) => AsyncRequestState
}

type DispatchProps = {
  fetchExtensions: () => void
  deleteExtension: ({ extensionId }: { extensionId: string }) => void
}

interface ConsumerProps {}

type ConnectedProps = StateProps & DispatchProps & ConsumerProps

const mapStateToProps = (state): StateProps => ({
  extensions: getDeploymentExtensions(state),
  fetchExtensionsRequest: fetchDeploymentExtensionsRequest(state),
  deleteExtensionRequest: (extensionId: string) =>
    deleteDeploymentExtensionRequest(state, extensionId),
})

const mapDispatchToProps: DispatchProps = {
  fetchExtensions,
  deleteExtension,
}

const loadingComponent = withLoading<ConnectedProps>(
  DeploymentExtensions,
  ({ fetchExtensions, fetchExtensionsRequest, extensions }) => ({
    transaction: `Plugins overview`,
    fetch: fetchExtensions,
    request: fetchExtensionsRequest,
    result: extensions,
    blockWhileLoading: false,
  }),
)

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(loadingComponent)
