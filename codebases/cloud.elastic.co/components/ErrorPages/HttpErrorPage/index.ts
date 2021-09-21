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

import HttpErrorPage from './HttpErrorPage'

import { isFeatureActivated } from '../../../selectors'

import Feature from '../../../lib/feature'

type StateProps = {
  isPortalEnabled: boolean
}

type DispatchProps = unknown

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => ({
  isPortalEnabled: isFeatureActivated(state, Feature.cloudPortalEnabled),
})

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(HttpErrorPage)
