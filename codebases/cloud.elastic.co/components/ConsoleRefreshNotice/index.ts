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

import ConsoleRefreshNotice from './ConsoleRefreshNotice'

import { getBuildTagMismatch } from '../../reducers'

import { isFeatureActivated } from '../../selectors'

import Feature from '../../lib/feature'

type StateProps = {
  buildTagMismatchFeature: boolean
  buildTagMismatch: boolean
}

interface DispatchProps {}

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => ({
  buildTagMismatchFeature: isFeatureActivated(state, Feature.buildTagMismatch),
  buildTagMismatch: getBuildTagMismatch(state),
})

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ConsoleRefreshNotice)
