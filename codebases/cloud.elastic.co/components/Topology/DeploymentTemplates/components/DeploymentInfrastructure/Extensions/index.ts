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

import Extensions, { Props } from './Extensions'

import { fetchExtensions } from '../../../../../../actions/deploymentExtensions'

import {
  fetchDeploymentExtensionsRequest,
  getDeploymentExtensions,
} from '../../../../../../reducers'

type StatePropKeys = 'extensions' | 'fetchExtensionsRequest'
type DispatchPropKeys = 'fetchExtensions'
type StateProps = Pick<Props, StatePropKeys>
type OwnProps = Omit<Props, StatePropKeys | DispatchPropKeys>

type DispatchProps = {
  fetchExtensions: () => void
}

const mapStateToProps = (state): StateProps => ({
  extensions: getDeploymentExtensions(state),
  fetchExtensionsRequest: fetchDeploymentExtensionsRequest(state),
})

const mapDispatchToProps: DispatchProps = {
  fetchExtensions,
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Extensions)
