'use es6';

import { parse } from 'hub-http/helpers/params';
import PortalIdParser from 'PortalIdParser';
var ESHREF_KEY = 'SETTINGS_NAV::cached-eschref';

var getPortalId = function getPortalId(pathname) {
  return PortalIdParser.parsePortalIdFromString(pathname, PortalIdParser.pathRegex);
};

export var isValideEschref = function isValideEschref(eschref, pathname, portalId) {
  return Boolean(eschref) && eschref.indexOf('/') === 0 && eschref.indexOf('//') !== 0 && getPortalId(pathname) === portalId;
};
export var extractEschrefFromLocation = function extractEschrefFromLocation() {
  var portalId = PortalIdParser.get();
  var _window$location = window.location,
      search = _window$location.search,
      pathname = _window$location.pathname;

  var _parse = parse(String(search).substr(1)),
      eschref = _parse.eschref;

  return isValideEschref(eschref, pathname, portalId) ? eschref : null;
};
var ReturnLinkHelper = {
  hydrate: function hydrate() {
    var eschref = extractEschrefFromLocation();

    if (eschref) {
      window.sessionStorage.setItem(ESHREF_KEY, extractEschrefFromLocation());
    }
  },
  get: function get() {
    var eschref = extractEschrefFromLocation();
    var cachedEschref = window.sessionStorage.getItem(ESHREF_KEY);

    if (eschref) {
      return eschref;
    } else if (cachedEschref) {
      return cachedEschref;
    }

    return null;
  },
  clear: function clear() {
    window.sessionStorage.removeItem(ESHREF_KEY);
  }
};
export default ReturnLinkHelper;