'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import Request from '../../request/Request';
import * as http from '../../request/http';
import { makeOption } from '../Option';
import { Map as ImmutableMap, List } from 'immutable';
var URL = 'inbounddb-io/imports/get-names';
var BATCH_SIZE = 100;

function fetch(keys) {
  return http.retrieve(Request.put({
    url: URL,
    data: _toConsumableArray(keys)
  })).then(function (names) {
    return names.get('hits', ImmutableMap()).map(function (name, key) {
      return makeOption(key, name);
    });
  });
}

var getImports = function getImports(keys) {
  var batches = [];

  for (var offset = 0; offset < keys.count(); offset += BATCH_SIZE) {
    batches.push(fetch(keys.slice(offset, offset + BATCH_SIZE)));
  }

  return Promise.all(batches).then(function (responses) {
    return responses.reduce(function (final, response) {
      return final.merge(response);
    }, ImmutableMap());
  });
};

export default getImports;
export var imports = function imports(ids) {
  return getImports(List(ids)).then(function (options) {
    return options.reduce(function (breakdowns, option) {
      return Object.assign({}, breakdowns, _defineProperty({}, option.get('value'), option.get('label')));
    }, {});
  });
};