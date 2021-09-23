'use es6';

import { getCookie } from './cookieHelper';
import PortalIdParser from 'PortalIdParser';
import createUUID from './createUUID';
export default (function () {
  var preferredId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var labsId = preferredId || PortalIdParser.get() || getCookie('__hstc') || createUUID();
  return String(labsId);
});