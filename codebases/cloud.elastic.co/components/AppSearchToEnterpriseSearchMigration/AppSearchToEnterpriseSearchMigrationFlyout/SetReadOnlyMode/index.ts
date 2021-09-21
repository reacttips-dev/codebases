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

import SetReadOnlyMode from './SetReadOnlyMode'

import { setAppSearchReadOnlyMode } from '../../../../actions/appSearchToEnterpriseSearchMigration/appSearchReadOnlyMode'
import { setAppSearchReadOnlyModeRequest } from '../../../../reducers'

import { ReduxState } from '../../../../types'
import { StateProps, DispatchProps, ConsumerProps } from './types'

const mapStateToProps: (state: ReduxState, consumerProps: ConsumerProps) => StateProps = (
  state,
  { deployment },
) => ({
  setAppSearchReadOnlyModeRequest: setAppSearchReadOnlyModeRequest(state, deployment.id),
})

const mapDispatchToProps = (dispatch): DispatchProps => ({
  setAppSearchReadOnlyMode: (args) => dispatch(setAppSearchReadOnlyMode(args)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SetReadOnlyMode)
