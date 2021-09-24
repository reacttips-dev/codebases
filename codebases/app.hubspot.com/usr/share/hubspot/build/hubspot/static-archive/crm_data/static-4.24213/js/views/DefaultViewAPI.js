'use es6';

import { get, put } from 'crm_data/api/ImmutableAPI';
import { DEFAULT_DEFAULT_VIEW } from './DefaultDefaultView';

var getUrl = function getUrl(objectTypeId) {
  return "/sales/v3/views/" + objectTypeId + "/default";
};

export var getDefaultView = function getDefaultView(objectTypeId) {
  return get(getUrl(objectTypeId)).then(function (response) {
    return response.get('id') || DEFAULT_DEFAULT_VIEW;
  });
};
export var setDefaultView = function setDefaultView(_ref) {
  var objectTypeId = _ref.objectTypeId,
      viewId = _ref.viewId;
  return put(getUrl(objectTypeId) + "/" + viewId);
};