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

import AccountSecurity from './AccountSecurity'

import {
  disableMfaDeviceRequest,
  enableMfaDeviceRequest,
  getMfaDevices,
  getMfaEnabled,
} from '../../reducers'

import { fetchMfaDevicesRequest } from '../../../../reducers'

import { disableMfa, enableMfa, fetchMfaDevices, fetchMfaStatus } from '../../actions/mfa'
import { isFeatureActivated } from '../../../../selectors'
import Feature from '../../../../lib/feature'

const mapStateToProps = (state) => ({
  isIpFilteringEnabled: isFeatureActivated(state, Feature.ipFilteringEnabled),
  mfaEnabled: getMfaEnabled(state),
  mfaDevices: getMfaDevices(state),
  fetchMfaDevicesRequest: fetchMfaDevicesRequest(state),
  disableMfaDeviceRequest: disableMfaDeviceRequest(state),
  enableMfaDeviceRequest: enableMfaDeviceRequest(state),
})

export default connect(mapStateToProps, {
  fetchMfaStatus,
  enableMfa,
  disableMfa,
  fetchMfaDevices,
})(AccountSecurity)
