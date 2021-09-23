'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap, _activityTypes;

import { handleActions } from 'redux-actions';
import { List, Map as ImmutableMap } from 'immutable';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { getHubSpotCallingProvider } from 'calling-lifecycle-internal/call-provider/operators/callProviderOperators';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestSucceeded } from 'conversations-async-data/async-data/operators/requestSucceeded';
import { SETTINGS_OMNIBUS } from '../../settings-omnibus/actions/asyncActionTypes';
import { SET_SELECTED_CALL_PROVIDER } from '../actions/ActionTypes';
import getCallProvidersFromOmnibus from 'calling-lifecycle-internal/call-provider/operators/getCallProvidersFromOmnibus';
import { getInstalledCallingProviders } from 'calling-extensions-sdk-support/external-provider/operators/getInstalledCallingProviders';
import { getAircallInstalledFromOmnibus, getInstalledCallingApplicationsFromOmnibus } from 'calling-settings-ui-library/settings-omnibus/operators/getPropertiesFromSettingsOmnibus';
import { getPersistedCallProvider, setPersistedCallProvider } from 'calling-lifecycle-internal/utils/getLocalCallSettings';
var selectedCallProvider = 'selectedCallProvider';
var initialState = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, selectedCallProvider, getPersistedCallProvider()), _defineProperty(_ImmutableMap, "callProvidersList", AsyncData({
  data: List([getHubSpotCallingProvider()])
})), _ImmutableMap));
var activityTypes = (_activityTypes = {}, _defineProperty(_activityTypes, SET_SELECTED_CALL_PROVIDER, function (state, _ref) {
  var payload = _ref.payload;
  setPersistedCallProvider(payload);
  return state.set(selectedCallProvider, payload);
}), _defineProperty(_activityTypes, SETTINGS_OMNIBUS.STARTED, function (state) {
  return state.update('callProvidersList', requestStarted);
}), _defineProperty(_activityTypes, SETTINGS_OMNIBUS.FAILED, function (state) {
  return state.update('callProvidersList', requestFailed);
}), _defineProperty(_activityTypes, SETTINGS_OMNIBUS.SUCCEEDED, function (state, _ref2) {
  var payload = _ref2.payload;
  var installedCallingApplications = getInstalledCallingApplicationsFromOmnibus(payload.data);
  var isAircallInstalled = getAircallInstalledFromOmnibus(payload.data);
  var installedCallingProviders = getInstalledCallingProviders({
    installedCallingApplications: installedCallingApplications,
    isAircallInstalled: isAircallInstalled
  });
  var providers = getCallProvidersFromOmnibus(payload.data, payload.requestArgs.isUngatedForCallingDisabledAllowThirdParty, installedCallingProviders.size > 0);
  providers = providers.concat(installedCallingProviders);
  state = state.setIn(['callProvidersList', 'data'], providers).update('callProvidersList', requestSucceeded);
  return state;
}), _activityTypes);
export default handleActions(activityTypes, initialState);