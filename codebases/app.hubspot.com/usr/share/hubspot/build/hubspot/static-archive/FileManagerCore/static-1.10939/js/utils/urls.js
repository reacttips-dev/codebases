'use es6';

import PortalIdParser from 'PortalIdParser';
export var getAccountVerificationUrl = function getAccountVerificationUrl() {
  return "/account-verification/" + PortalIdParser.get() + "?source=FILE_MANAGER";
};