'use es6';

import Url from 'urlinator/Url';
import getApiHostForEnvironment from './getApiHostForEnvironment';
import PortalIdParser from 'PortalIdParser';
export default function getApiUrl(path) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!path || typeof path !== 'string' || typeof params !== 'object' || Array.isArray(params)) {
    return null;
  }

  var pathWithLeadingSlash = path[0] === '/' ? path : "/" + path;
  var url = new Url(pathWithLeadingSlash, {
    hostname: getApiHostForEnvironment(),
    params: Object.assign({
      portalId: PortalIdParser.get()
    }, params)
  });
  return url ? url.href : null;
}