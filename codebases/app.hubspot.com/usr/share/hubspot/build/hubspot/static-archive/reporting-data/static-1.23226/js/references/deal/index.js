'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import I18n from 'I18n';
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import { DEALS } from '../../constants/dataTypes';
import { DATA_TYPE_TO_HUBSPOT_OBJECT_COORDINATES } from '../../constants/objectCoordinates';
import chunk from '../../lib/async/chunk';
import { Promise } from '../../lib/promise';
import * as http from '../../request/http';
import { makeOption } from '../Option';

var getDeals = function getDeals() {
  var deals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  return chunk(function (group) {
    return http.post('inbounddb-objects/v1/preview', {
      data: _defineProperty({}, DATA_TYPE_TO_HUBSPOT_OBJECT_COORDINATES.get(DEALS), group.toArray())
    }).then(fromJS);
  }, function (responses) {
    return responses[0].get(DATA_TYPE_TO_HUBSPOT_OBJECT_COORDINATES.get(DEALS));
  }, deals);
};

export var generateDealLabel = function generateDealLabel(dealInfo, key) {
  var name = dealInfo.get('dealname') || dealInfo.getIn(['properties', 'dealname', 'value'], null);
  return name || I18n.text('reporting-data.references.deal.unknown', {
    id: key
  });
};
export default (function (ids) {
  if (ids.isEmpty()) {
    return Promise.resolve(ImmutableMap());
  }

  var sanitized = ids.reduce(function (memo, id) {
    var parsed = Number(id);
    return parsed ? memo.set(String(parsed), id) : memo;
  }, ImmutableMap());
  return getDeals(sanitized.keySeq().toList()).then(function (deals) {
    return fromJS(deals).reduce(function (options) {
      var dealInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
      var dealId = arguments.length > 2 ? arguments[2] : undefined;
      return options.set(String(dealId), makeOption(sanitized.get(dealId, dealId), generateDealLabel(dealInfo, dealId)));
    }, ImmutableMap());
  });
});