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

import DeploymentRegion from './DeploymentRegion'

import { fetchProvidersIfNeeded } from '../../../../actions/regions'

import { getRegionName } from '../../../../reducers'

import { ReduxState } from '../../../../types'

type StateProps = {
  regionName: string
}

type DispatchProps = {
  fetchProvidersIfNeeded: () => void
}

type ConsumerProps = {
  regionId?: string | null
}

const mapStateToProps = (state: ReduxState, { regionId }): StateProps => ({
  regionName: getRegionName(state, regionId),
})

const mapDispatchToProps: DispatchProps = {
  fetchProvidersIfNeeded,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DeploymentRegion)
