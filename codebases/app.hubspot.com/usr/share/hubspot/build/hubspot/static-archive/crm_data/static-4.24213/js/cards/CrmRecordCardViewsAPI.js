'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import makeBatch from 'crm_data/api/makeBatch';
export var fetchView = function fetchView(options) {
  var objectTypeId = options.get('objectTypeId');
  var location = options.get('location');
  return ImmutableAPI.get("crm-record-cards/v3/views/" + encodeURIComponent(objectTypeId) + "?location=" + encodeURIComponent(location));
};
export var fetchViewBatch = makeBatch(fetchView, 'CrmRecordCardViewsAPI.fetchBatch');