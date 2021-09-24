'use es6';

import { get, put } from 'crm_data/api/ImmutableAPI';
var URI = 'sales/v1/property-requirements/TICKET/DEALSTAGE';
export function fetch() {
  return get(URI + "/all");
}
export function saveTicketStageProperties(_ref) {
  var stageId = _ref.stageId,
      properties = _ref.properties;
  return put(URI + "?actionId=" + encodeURIComponent(stageId), properties);
}