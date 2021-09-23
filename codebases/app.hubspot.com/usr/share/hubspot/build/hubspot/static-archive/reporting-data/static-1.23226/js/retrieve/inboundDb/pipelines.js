'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Objects;

import * as http from '../../request/http';
import toJS from '../../lib/toJS';
import precondition from '../../lib/precondition';
import { DEALS, TICKETS } from '../../constants/dataTypes';
var URL = 'pipelines/v2/pipelines';
var Objects = (_Objects = {}, _defineProperty(_Objects, DEALS, 'DEAL'), _defineProperty(_Objects, TICKETS, 'TICKET'), _Objects);
var VALID_TYPES = Object.keys(Objects);
export var get = precondition(function (type) {
  return VALID_TYPES.includes(type);
}, function (type) {
  return "expected one of " + VALID_TYPES + ", but got " + type;
})(function (type) {
  return http.get(URL + "/" + Objects[type], {
    query: {
      includeStageMetaPropertyNames: true
    }
  }).then(toJS);
});