'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { handleActions } from 'redux-actions';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { SUCCEEDED, UNINITIALIZED } from 'conversations-async-data/async-data/constants/asyncStatuses';
import { SETTINGS_OMNIBUS } from '../../settings-omnibus/actions/asyncActionTypes';
import { getSettingsOmnibusFetch } from '../../settings-omnibus/operators/getSettingsOmnibusFetch';
import CallingAdminSettings from 'calling-lifecycle-internal/records/calling-admin-settings/CallingAdminSettings';
import { getCallingAdminSettingsFromOmnibus } from '../../settings-omnibus/operators/getPropertiesFromSettingsOmnibus';
var callingAdminSettings = getCallingAdminSettingsFromOmnibus(getSettingsOmnibusFetch());
var initialState = AsyncData({
  status: callingAdminSettings ? SUCCEEDED : UNINITIALIZED,
  data: new CallingAdminSettings(callingAdminSettings)
});

var callingAdminSettingsReducer = _defineProperty({}, SETTINGS_OMNIBUS.SUCCEEDED, function (state, _ref) {
  var payload = _ref.payload;
  var rawCallingAdminSettings = getCallingAdminSettingsFromOmnibus(payload.data) || {};
  return requestSucceededWithOperator(function () {
    return new CallingAdminSettings(rawCallingAdminSettings);
  }, state);
});

export default handleActions(callingAdminSettingsReducer, initialState);