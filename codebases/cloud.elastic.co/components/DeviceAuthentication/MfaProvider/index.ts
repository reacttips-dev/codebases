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

import MfaProvider from './MfaProvider'

import {
  getMfaDevices,
  getMfaEnabled,
  activateMfaDeviceRequest,
  enrollMfaDeviceRequest,
  disableMfaDeviceRequest,
  enableMfaDeviceRequest,
  removeMfaDeviceRequest,
} from '../../../apps/userconsole/reducers'

import {
  activateMfaDevice,
  disableMfa,
  enableMfa,
  enrollMfaDevice,
  fetchMfaDevices,
  fetchMfaStatus,
  removeMfaDevice,
  resetMfaEnrollment,
} from '../../../apps/userconsole/actions/mfa'

const mapStateToProps = (state) => ({
  activateMfaDeviceRequest: (device_id) => activateMfaDeviceRequest(state, device_id),
  disableMfaDeviceRequest: disableMfaDeviceRequest(state),
  enableMfaDeviceRequest: enableMfaDeviceRequest(state),
  enrollMfaDeviceRequest: (device_type) => enrollMfaDeviceRequest(state, device_type),
  mfaEnabled: getMfaEnabled(state),
  mfaDevices: getMfaDevices(state),
  removeMfaDeviceRequest: (device_id) => removeMfaDeviceRequest(state, device_id),
})

export default connect(mapStateToProps, {
  fetchMfaStatus,
  enableMfa,
  disableMfa,
  fetchMfaDevices,
  enrollMfaDevice,
  activateMfaDevice,
  removeMfaDevice,
  resetMfaEnrollment,
})(MfaProvider)
