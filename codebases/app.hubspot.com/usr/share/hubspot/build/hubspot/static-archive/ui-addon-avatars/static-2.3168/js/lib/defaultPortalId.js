'use es6';

import PortalIdParser from 'PortalIdParser';
export default function defaultPortalId() {
  return PortalIdParser.get();
}