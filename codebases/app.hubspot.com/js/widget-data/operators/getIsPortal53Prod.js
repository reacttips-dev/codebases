'use es6';

import PortalIdParser from 'PortalIdParser';
import { PORTAL_53_ID } from '../constants/portal53Ids';
export var getIsPortal53Prod = function getIsPortal53Prod() {
  return PortalIdParser.get() === PORTAL_53_ID;
};