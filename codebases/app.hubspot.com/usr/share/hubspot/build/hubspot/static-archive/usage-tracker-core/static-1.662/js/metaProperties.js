'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { between, cleanUrl, truncate, makeUuid, once, omit } from './common/helpers';
import { hamplitudeKey } from './storageKeys';
var SESSION_LENGTH_IN_MILLISECONDS = 1000 * 60 * 30; // 30 minutes

var OPERATING_SYSTEMS = [{
  name: 'windows 10',
  pattern: /(Windows 10.0|Windows NT 10.0)/
}, {
  name: 'windows 8',
  pattern: /(Windows 8|Windows8.1|Windows NT 6.2|Windows NT 6.3)/
}, {
  name: 'windows 7',
  pattern: /(Windows 7|Windows NT 6.1)/
}, {
  name: 'windows vista',
  pattern: /Windows NT 6.0/
}, {
  name: 'windows xp',
  pattern: /(Windows NT 5.1|Windows XP)/
}, {
  name: 'android',
  pattern: /Android/
}, {
  name: 'linux',
  pattern: /(Linux|X11)/
}, {
  name: 'ios',
  pattern: /(iPhone|iPad|iPod)/
}, {
  name: 'mac',
  pattern: /Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh/
}];
var _hamplitudeProperties = null;

var getDefaultHamplitudeProperties = function getDefaultHamplitudeProperties(currentTime, deviceIdOverride) {
  return {
    device_id: deviceIdOverride || makeUuid(),
    last_event_id: 0,
    last_sequence_number: 0,
    last_timestamp_checked_against_session: currentTime,
    session_id: currentTime
  };
};

var getHamplitudeProperties = function getHamplitudeProperties(getTempStorage, currentTime, deviceIdOverride) {
  var hamplitudeProperties = _hamplitudeProperties;

  if (!hamplitudeProperties) {
    hamplitudeProperties = getTempStorage(hamplitudeKey);

    if (!hamplitudeProperties) {
      hamplitudeProperties = getDefaultHamplitudeProperties(currentTime, deviceIdOverride);
    } else {
      try {
        hamplitudeProperties = JSON.parse(hamplitudeProperties);
      } catch (err) {
        hamplitudeProperties = getDefaultHamplitudeProperties(currentTime, deviceIdOverride);
      }
    }
  }

  return hamplitudeProperties;
};

var setHamplitudeProperties = function setHamplitudeProperties(setTempStorage, hamplitudeProperties) {
  _hamplitudeProperties = hamplitudeProperties;
  setTempStorage(hamplitudeKey, JSON.stringify(hamplitudeProperties));
};

export var refreshHamplitudeProperties = function refreshHamplitudeProperties(hamplitudeProperties, currentTime, deviceIdOverride) {
  var last_event_id = hamplitudeProperties.last_event_id,
      last_sequence_number = hamplitudeProperties.last_sequence_number,
      session_id = hamplitudeProperties.session_id,
      last_timestamp_checked_against_session = hamplitudeProperties.last_timestamp_checked_against_session,
      rest = _objectWithoutProperties(hamplitudeProperties, ["last_event_id", "last_sequence_number", "session_id", "last_timestamp_checked_against_session"]);

  var refreshed = Object.assign({}, rest);
  var timeSinceSessionRefresh = currentTime - last_timestamp_checked_against_session;

  if (timeSinceSessionRefresh > SESSION_LENGTH_IN_MILLISECONDS) {
    refreshed.last_event_id = 0;
    refreshed.session_id = currentTime;
  } else {
    refreshed.session_id = session_id;
    refreshed.last_timestamp_checked_against_session = currentTime;
  }

  refreshed.last_event_id = last_event_id + 1;
  refreshed.last_sequence_number = last_sequence_number + 1;

  if (deviceIdOverride && typeof deviceIdOverride === 'string' && deviceIdOverride !== hamplitudeProperties.device_id) {
    refreshed.device_id = deviceIdOverride;
  }

  return refreshed;
};

var getAndRefreshHamplitudeProperties = function getAndRefreshHamplitudeProperties(getTempStorage, setTempStorage, currentTime, deviceIdOverride) {
  var hamplitudeProperties = refreshHamplitudeProperties(getHamplitudeProperties(getTempStorage, currentTime, deviceIdOverride), currentTime, deviceIdOverride);
  setHamplitudeProperties(setTempStorage, hamplitudeProperties);
  return hamplitudeProperties;
};

var lookupOperatingSystem = function lookupOperatingSystem(fingerprint) {
  var match = 'unknown';

  try {
    OPERATING_SYSTEMS.forEach(function (_ref) {
      var name = _ref.name,
          pattern = _ref.pattern;

      if (pattern.test(fingerprint)) {
        match = name;
      }
    });
  } catch (err) {
    /* DO NOTHING */
  }

  return match.toLowerCase();
};

export var getDynamicMetaProperties = function getDynamicMetaProperties(_ref2, deviceIdOverride) {
  var getCurrentHref = _ref2.getCurrentHref,
      getNetworkType = _ref2.getNetworkType,
      getNetworkSpeed = _ref2.getNetworkSpeed,
      getTempStorage = _ref2.getTempStorage,
      setTempStorage = _ref2.setTempStorage;
  var currentTime = Date.now();
  var currentPageUrl = getCurrentHref();
  var hamplitudeProperties = getAndRefreshHamplitudeProperties(getTempStorage, setTempStorage, currentTime, deviceIdOverride);
  var dynamicProperties = Object.assign({}, hamplitudeProperties, {
    timestamp: currentTime,
    currentPageUrl: truncate(currentPageUrl, 256),
    currentPageUrlCleaned: cleanUrl(currentPageUrl),
    networkType: getNetworkType(),
    networkSpeed: getNetworkSpeed()
  });

  if (deviceIdOverride && typeof deviceIdOverride === 'string') {
    dynamicProperties.hasDeviceIdOverride = true;
  }

  return dynamicProperties;
}; // Args visible for tests

export var getStaticMetaProperties = function getStaticMetaProperties(_ref3) {
  var clientName = _ref3.clientName,
      getReferrer = _ref3.getReferrer,
      getUserAgent = _ref3.getUserAgent,
      getScreenWidth = _ref3.getScreenWidth,
      getScreenHeight = _ref3.getScreenHeight,
      getWindowWidth = _ref3.getWindowWidth,
      getWindowHeight = _ref3.getWindowHeight,
      getDeployableName = _ref3.getDeployableName,
      getDeployableVersion = _ref3.getDeployableVersion;
  var staticProperties = {
    windowWidth: -1,
    windowHeight: -1,
    screenWidth: -1,
    screenHeight: -1,
    screenSize: -1,
    lastPageUrl: '',
    lastPageUrlCleaned: '',
    howOsDetailed: '',
    singlePageAppSessionId: Date.now(),
    trackingClient: clientName || 'custom',
    deployableName: '',
    deployableVersion: ''
  };
  staticProperties.windowWidth = getWindowWidth();
  staticProperties.windowHeight = getWindowHeight();
  staticProperties.deployableName = getDeployableName();
  staticProperties.deployableVersion = getDeployableVersion();
  staticProperties.howOsDetailed = lookupOperatingSystem(between(getUserAgent(), '(', ')'));
  staticProperties.screenWidth = getScreenWidth();
  staticProperties.screenHeight = getScreenHeight();

  if (!isNaN(getScreenWidth())) {
    if (getScreenWidth() > 1024) {
      staticProperties.screenSize = 'large (> 1024)';
    } else if (getScreenWidth() > 680) {
      staticProperties.screenSize = 'medium (680 - 1024)';
    } else {
      staticProperties.screenSize = 'small (< 680)';
    }
  }

  var lastPageUrl = getReferrer();
  staticProperties.lastPageUrl = truncate(lastPageUrl, 256);
  staticProperties.lastPageUrlCleaned = cleanUrl(lastPageUrl);
  return staticProperties;
};
/*
 *  metaProperties = properties that get stamped to each event
 *   staticProperties = properties that get set once on page load
 *   dynamicProperties = properties that can change for each event
 */

var getStaticMetaPropertiesOnce = once(getStaticMetaProperties);
export var getMetaProperties = function getMetaProperties() {
  var dependencies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    clientName: '',
    getReferrer: function getReferrer() {
      return '';
    },
    getUserAgent: function getUserAgent() {
      return '';
    },
    getNetworkType: function getNetworkType() {
      return '';
    },
    getNetworkSpeed: function getNetworkSpeed() {
      return '';
    },
    getScreenWidth: function getScreenWidth() {
      return '';
    },
    getScreenHeight: function getScreenHeight() {
      return '';
    },
    getWindowWidth: function getWindowWidth() {
      return '';
    },
    getWindowHeight: function getWindowHeight() {
      return '';
    },
    getDeployableName: function getDeployableName() {
      return '';
    },
    getDeployableVersion: function getDeployableVersion() {
      return '';
    }
  };

  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref4$deviceIdOverrid = _ref4.deviceIdOverride,
      deviceIdOverride = _ref4$deviceIdOverrid === void 0 ? '' : _ref4$deviceIdOverrid;

  var metaProperties = Object.assign({}, getStaticMetaPropertiesOnce(dependencies), {}, getDynamicMetaProperties(dependencies, deviceIdOverride));
  var emptyProperties = Object.keys(metaProperties).filter(function (key) {
    return !metaProperties[key];
  });
  return omit(metaProperties, emptyProperties);
};