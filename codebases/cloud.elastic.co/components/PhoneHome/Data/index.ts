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

import PhoneHomeData from './Data'

import { runPhoneHomeIfNeeded } from '../../../actions/phoneHome'

import { getRoot, isPhoneHomeDisabled } from '../../../reducers'

import { isFeatureActivated, getConfigForKey } from '../../../selectors'

import Feature from '../../../lib/feature'

import { RootConfig } from '../../../types'

type StateProps = {
  root: RootConfig
  phoneHomeActivated: boolean
  baseTelemetryUrl: string
  isPhoneHomeDisabled: boolean
}

type DispatchProps = {
  runPhoneHomeIfNeeded: (root: RootConfig, baseTelemetryUrl: string) => void
}

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => ({
  root: getRoot(state),
  phoneHomeActivated: isFeatureActivated(state, Feature.phoneHome),
  isPhoneHomeDisabled: isPhoneHomeDisabled(state),
  baseTelemetryUrl: getConfigForKey(state, `TELEMETRY_URL`),
})

const mapDispatchToProps: DispatchProps = {
  runPhoneHomeIfNeeded,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false },
)(PhoneHomeData)
