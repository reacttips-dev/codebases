'use es6';

import enviro from 'enviro';
import PortalIdParser from 'PortalIdParser';
export default (function () {
  return enviro.isProd() && PortalIdParser.get() === 53 || enviro.isQa() && PortalIdParser.get() === 99535353;
});