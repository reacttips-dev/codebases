'use es6';

import { get, put } from 'crm_data/api/ImmutableAPI';

var getV3Url = function getV3Url(objectTypeId) {
  return "sales/v3/views/" + objectTypeId + "/pinned";
};

export var fetch = function fetch(_ref) {
  var objectTypeId = _ref.objectTypeId;
  return get(getV3Url(objectTypeId), {
    count: 5
  }).then(function (response) {
    return response.get('results');
  });
};
export var save = function save(_ref2) {
  var objectTypeId = _ref2.objectTypeId,
      viewIds = _ref2.viewIds;
  return put(getV3Url(objectTypeId), viewIds);
};