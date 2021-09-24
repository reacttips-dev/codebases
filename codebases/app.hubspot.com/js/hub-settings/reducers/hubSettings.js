'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { handleActions } from 'redux-actions';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { SUCCEEDED, UNINITIALIZED } from 'conversations-async-data/async-data/constants/asyncStatuses';
import { SETTINGS_OMNIBUS } from '../../settings-omnibus/actions/asyncActionTypes';
import { getSettingsOmnibusFetch } from '../../settings-omnibus/operators/getSettingsOmnibusFetch';
import getHubSettingsFromOmnibus from '../../settings-omnibus/operators/getHubSettingsFromOmnibus';
import HubSettings from '../records/HubSettings';
var hubSettings = getHubSettingsFromOmnibus(getSettingsOmnibusFetch()) || {};
var initialState = AsyncData({
  status: hubSettings ? SUCCEEDED : UNINITIALIZED,
  data: new HubSettings(hubSettings)
});

var initialLoadSettingsReducer = _defineProperty({}, SETTINGS_OMNIBUS.SUCCEEDED, function (state, _ref) {
  var payload = _ref.payload;
  var rawHubSettings = getHubSettingsFromOmnibus(payload.data) || {};
  return requestSucceededWithOperator(function () {
    return new HubSettings(rawHubSettings);
  }, state);
});

export default handleActions(initialLoadSettingsReducer, initialState);