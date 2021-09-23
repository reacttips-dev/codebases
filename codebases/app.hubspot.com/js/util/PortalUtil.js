'use es6';

import PortalIdParser from 'PortalIdParser';
export function getCurrentPortalId() {
  return PortalIdParser.get();
}