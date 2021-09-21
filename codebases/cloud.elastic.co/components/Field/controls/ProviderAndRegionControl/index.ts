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
import ProviderAndRegionControl from './ProviderAndRegionControl'
import { fetchProviders } from '../../../../actions/regions'
import { fetchProvidersRequest, getProviders } from '../../../../reducers'
import { StateProps, DispatchProps, ConsumerProps } from './types'

import { ThunkDispatch } from '../../../../types'

const mapStateToProps = (state): StateProps => ({
  fetchProviderRequest: fetchProvidersRequest(state),
  providers: getProviders(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  fetchProviders: () => dispatch(fetchProviders()),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ProviderAndRegionControl)
