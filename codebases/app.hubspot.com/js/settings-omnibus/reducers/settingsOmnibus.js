'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _settingsOmnibusReduc;

import { Map as ImmutableMap } from 'immutable';
import { handleActions } from 'redux-actions';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { SUCCEEDED, UNINITIALIZED } from 'conversations-async-data/async-data/constants/asyncStatuses';
import { SETTINGS_OMNIBUS } from '../actions/asyncActionTypes';
import { getSettingsOmnibusFetch } from '../operators/getSettingsOmnibusFetch';
import { getPortalSettingsFromOmnibus } from '../operators/getPropertiesFromSettingsOmnibus';
import PortalSummary from 'calling-settings-ui-library/settings-omnibus/records/PortalSummary';
var omnibusSettings = getSettingsOmnibusFetch();
var initialState = AsyncData({
  status: omnibusSettings ? SUCCEEDED : UNINITIALIZED,
  data: ImmutableMap({
    portalSummary: new PortalSummary()
  })
});
var settingsOmnibusReducer = (_settingsOmnibusReduc = {}, _defineProperty(_settingsOmnibusReduc, SETTINGS_OMNIBUS.STARTED, requestStarted), _defineProperty(_settingsOmnibusReduc, SETTINGS_OMNIBUS.SUCCEEDED, function (state, _ref) {
  var payload = _ref.payload;
  var data = payload.data;
  var portalSummary = getPortalSettingsFromOmnibus(data) || {};
  return requestSucceededWithOperator(function () {
    return ImmutableMap({
      portalSummary: new PortalSummary(portalSummary)
    });
  }, state);
}), _defineProperty(_settingsOmnibusReduc, SETTINGS_OMNIBUS.FAILED, requestFailed), _settingsOmnibusReduc);
export default handleActions(settingsOmnibusReducer, initialState);