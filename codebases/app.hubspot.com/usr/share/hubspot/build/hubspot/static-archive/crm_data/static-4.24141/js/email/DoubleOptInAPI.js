'use es6';

import { get } from 'crm_data/api/ImmutableAPI';
import PortalIdParser from 'PortalIdParser';
export function fetch() {
  var url = "email/v1/optin/portals/" + PortalIdParser.get() + "/settings-summary";
  return get(url);
}