'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
var API = 'crm/ml-integration/v1/auto-suggest/';

function fetch(_ref) {
  var fromObjectType = _ref.fromObjectType,
      fromObjectId = _ref.fromObjectId,
      toObjectType = _ref.toObjectType;
  var uri = "" + API + encodeURIComponent(fromObjectType) + "/" + encodeURIComponent(fromObjectId) + "/" + encodeURIComponent(toObjectType) + "?limit=100";
  return ImmutableAPI.get(uri);
}

export var sendOptionIds = function sendOptionIds(_ref2) {
  var response = _ref2.response,
      fromObjectType = _ref2.fromObjectType,
      toObjectType = _ref2.toObjectType,
      toObjectIds = _ref2.toObjectIds;
  var optionIds = response.get('crmObjectOptionsByPriority'); //options that were suggested that the user did not select

  var negativeOptionIds = optionIds.filter(function (optionId) {
    return !toObjectIds.includes(optionId.get('objectId'));
  }).map(function (option) {
    return option.get('objectId');
  });
  var uri = "" + API + encodeURIComponent(fromObjectType) + "/" + encodeURIComponent(toObjectType) + "/" + encodeURIComponent(response.get('correlationId'));
  var body = {
    positiveOptionIds: toObjectIds,
    negativeOptionIds: negativeOptionIds
  };
  return ImmutableAPI.post(uri, body).catch(function (error) {
    var errorJSON = error.responseJSON;

    if (errorJSON.subCategory.includes('UNSUPPORTED_OBJECT_TYPE_PAIR')) {
      // auto-suggestions not implemented for this pair as of yet
      return;
    }

    throw error;
  });
};
export function getSuggestedAssociations(_ref3) {
  var fromObjectType = _ref3.fromObjectType,
      fromObjectId = _ref3.fromObjectId,
      toObjectType = _ref3.toObjectType;
  return fetch({
    fromObjectType: fromObjectType,
    fromObjectId: fromObjectId,
    toObjectType: toObjectType
  }).then(function (response) {
    return response;
  }).catch(function (error) {
    var errorJSON = error.responseJSON;

    if (errorJSON.subCategory.includes('UNSUPPORTED_OBJECT_TYPE_PAIR')) {
      // auto-suggestions not implemented for this pair as of yet
      return;
    }

    throw error;
  });
}