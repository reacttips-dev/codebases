'use es6';

import { getCurrentPortalId } from '../util/PortalUtil';
export function getPortalKey(key) {
  return key + "_" + getCurrentPortalId();
}