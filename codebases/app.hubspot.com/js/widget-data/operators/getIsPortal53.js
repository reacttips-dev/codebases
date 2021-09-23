'use es6';

import PortalIdParser from 'PortalIdParser';
import { PORTAL_53_ID, PORTAL_53_QA_ID } from '../constants/portal53Ids';
import enviro from 'enviro';
export var getIsPortal53 = function getIsPortal53() {
  return PortalIdParser.get() === PORTAL_53_ID || enviro.isQa() && PortalIdParser.get() === PORTAL_53_QA_ID;
};