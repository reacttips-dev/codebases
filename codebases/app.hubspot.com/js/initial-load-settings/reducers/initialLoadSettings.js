'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { handleActions } from 'redux-actions';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { SUCCEEDED, UNINITIALIZED } from 'conversations-async-data/async-data/constants/asyncStatuses';
import { getSettingsOmnibusFetch } from 'calling-communicator-ui/settings-omnibus/operators/getSettingsOmnibusFetch';
import { SETTINGS_OMNIBUS } from 'calling-communicator-ui/settings-omnibus/actions/asyncActionTypes';
import getInitialLoadSettingsFromOmnibus from 'calling-communicator-ui/settings-omnibus/operators/getInitialLoadSettingsFromOmnibus';
import InitialLoadSettings from 'calling-internal-common/initial-load-settings/record/InitialLoadSettings';
import buildInitialLoadSettings from 'calling-communicator-ui/initial-load-settings/utils/buildInitialLoadSettings';
var initialLoadSettings = getInitialLoadSettingsFromOmnibus(getSettingsOmnibusFetch());
var initialState = AsyncData({
  status: initialLoadSettings ? SUCCEEDED : UNINITIALIZED,
  data: InitialLoadSettings.fromJS(initialLoadSettings || {})
});

var initialLoadSettingsReducer = _defineProperty({}, SETTINGS_OMNIBUS.SUCCEEDED, function (state, _ref) {
  var payload = _ref.payload;
  var rawInitialLoadSettings = getInitialLoadSettingsFromOmnibus(payload.data) || {};
  return requestSucceededWithOperator(function () {
    return buildInitialLoadSettings(rawInitialLoadSettings);
  }, state);
});

export default handleActions(initialLoadSettingsReducer, initialState);