'use es6';

import PortalIdParser from 'PortalIdParser';

var getBaseUrl = function getBaseUrl() {
  return '/social';
};

export var getRootUrl = function getRootUrl() {
  return getBaseUrl() + "/" + PortalIdParser.get();
};