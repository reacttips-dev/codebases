'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
import chunk from '../../lib/async/chunk';
import { Promise } from '../../lib/promise';
import * as http from '../../request/http';
import { makeOption } from '../Option';
import { DEFAULT_NULL_VALUES, GLOBAL_NULL } from '../../constants/defaultNullValues';
import { DATA_TYPE_TO_HUBSPOT_OBJECT_COORDINATES } from '../../constants/objectCoordinates';
import { COMPANIES } from '../../constants/dataTypes';

var getCompanies = function getCompanies() {
  var companies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  return chunk(function (group) {
    return http.post('inbounddb-objects/v1/preview', {
      data: _defineProperty({}, DATA_TYPE_TO_HUBSPOT_OBJECT_COORDINATES.get(COMPANIES), group.toArray())
    }).then(fromJS);
  }, function (responses) {
    return responses[0].get(DATA_TYPE_TO_HUBSPOT_OBJECT_COORDINATES.get(COMPANIES));
  }, companies);
};

export var generateCompanyLabel = function generateCompanyLabel(companyInfo, key) {
  return companyInfo.get('name', key === GLOBAL_NULL ? null : key);
};
export default (function (ids) {
  if (ids.isEmpty()) {
    return Promise.resolve(ImmutableMap());
  }

  var sanitized = ids.reduce(function (memo, id) {
    var parsed = Number(id);
    return parsed ? memo.set(String(parsed), id) : memo;
  }, ImmutableMap());
  return getCompanies(sanitized.keySeq().toList()).then(function (companies) {
    return fromJS(companies).reduce(function (options) {
      var companyInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
      var companyId = arguments.length > 2 ? arguments[2] : undefined;
      return options.set(String(companyId), makeOption(sanitized.get(companyId, companyId), companyInfo.getIn(['properties', 'name', 'value'], null)));
    }, ids.includes(String(DEFAULT_NULL_VALUES.NUMBER)) ? ImmutableMap(_defineProperty({}, DEFAULT_NULL_VALUES.NUMBER, makeOption(DEFAULT_NULL_VALUES.NUMBER, I18n.text('reporting-data.missing.value')))) : ImmutableMap());
  });
});