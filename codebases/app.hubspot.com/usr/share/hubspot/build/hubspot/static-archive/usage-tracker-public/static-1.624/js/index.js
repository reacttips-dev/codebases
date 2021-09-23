'use es6';

import PublicTrackingClient from './PublicTrackingClient';
var DEFAULT_OPTS = {
  allowUnauthed: true,
  isExternalHost: true
};
export var createTracker = function createTracker() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!opts || typeof opts !== 'object') {
    opts = {};
  }

  Object.keys(DEFAULT_OPTS).forEach(function (key) {
    var value = DEFAULT_OPTS[key];

    if (typeof opts[key] === 'undefined') {
      opts[key] = value;
    }
  });
  return PublicTrackingClient.createTracker(opts);
};