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
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'

import UserconsoleRootRoute from './UserconsoleRootRoute'

import Feature from '../../../../lib/feature'
import { isFeatureActivated } from '../../../../selectors'

type StateProps = {
  isPortalFeatureEnabled: boolean
}

interface DispatchProps {}

type ConsumerProps = RouteComponentProps

const mapStateToProps = (state): StateProps => ({
  isPortalFeatureEnabled: isFeatureActivated(state, Feature.cloudPortalEnabled),
})

const mapDispatchToProps: DispatchProps = {}

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(UserconsoleRootRoute),
)
