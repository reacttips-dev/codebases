import RegisteredFromNumber from 'calling-lifecycle-internal/records/registered-from-number/RegisteredFromNumber';
import { getSetting, setSetting } from '../local-settings/localSettings';
import { CALL_FROM_BROWSER } from 'calling-lifecycle-internal/constants/CallMethods';
import get from 'transmute/get';
import CallingProvider from '../call-provider/records/CallingProvider';
import { getHubSpotCallingProvider } from '../call-provider/operators/callProviderOperators';
export var PROVIDER = 'selectedCallProvider';
export var setPersistedCallProvider = function setPersistedCallProvider(callProvider) {
  return setSetting(PROVIDER, callProvider);
};
export var getPersistedCallProvider = function getPersistedCallProvider() {
  return getSetting(PROVIDER, getHubSpotCallingProvider(), function (data) {
    var width = data.width,
        height = data.height;

    if (data.options) {
      width = data.options.width;
      height = data.options.height;
      delete data.options;
    }

    return new CallingProvider(Object.assign({}, data, {
      width: width,
      height: height
    }));
  });
};
export var METHOD = 'selectedCallMethod';
export var setPersistedCallMethod = function setPersistedCallMethod(callMethod) {
  return setSetting(METHOD, callMethod);
};
export var getPersistedCallMethod = function getPersistedCallMethod() {
  return getSetting(METHOD, CALL_FROM_BROWSER);
};
export var FROM_NUMBER = 'selectedFromNumber';
export var CONNECT_FROM_NUMBER = 'selectedConnectFromNumber';
export var setPersistedFromNumber = function setPersistedFromNumber(selectedFromNumber) {
  return setSetting(FROM_NUMBER, selectedFromNumber);
};
export var setPersistedConnectFromNumber = function setPersistedConnectFromNumber(selectedFromNumber) {
  return setSetting(CONNECT_FROM_NUMBER, selectedFromNumber);
};
export var getPersistedFromNumber = function getPersistedFromNumber() {
  var fromNumberKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : FROM_NUMBER;
  return getSetting(fromNumberKey, null, function (properties) {
    return new RegisteredFromNumber(properties);
  });
};
export var getPersistedFromNumberWithFallback = function getPersistedFromNumberWithFallback(_ref) {
  var fromNumberKey = _ref.fromNumberKey,
      fromNumbers = _ref.fromNumbers;
  var defaultedNumber = fromNumbers && fromNumbers.find(function (number) {
    return get('default', number);
  });
  var defaultNumber = defaultedNumber || fromNumbers && get(0, fromNumbers);
  var defaultFromNumber = defaultNumber && new RegisteredFromNumber(defaultNumber) || null;
  var storedFromNumber = getPersistedFromNumber(fromNumberKey);

  if (!storedFromNumber) {
    setSetting(fromNumberKey, defaultFromNumber);
    return defaultFromNumber;
  }

  var currentFriendlyName = get('friendlyName', storedFromNumber);
  var hasCurrentFromNumber = fromNumbers && fromNumbers.find(function (fromNumber) {
    var friendlyName = get('friendlyName', fromNumber);
    return friendlyName === currentFriendlyName;
  });

  if (hasCurrentFromNumber) {
    return storedFromNumber;
  } // User deleted the current saved fromNumber


  setSetting(fromNumberKey, defaultFromNumber);
  return defaultFromNumber;
};
export var GATES = 'Gates';
export var getGatesFromStorage = function getGatesFromStorage() {
  return getSetting(GATES, [], function (gates) {
    return gates && gates.split(',') || [];
  });
};