'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _require = require('legacy-hubspot-bender-context'),
    bender = _require.bender;

import { getMessagesUtk } from '../query-params/getMessagesUtk';
import { handleResolve } from './handleResolve';
export default function applyDefaults(method, url, data) {
  var _Object$assign;

  data.query = Object.assign((_Object$assign = {}, _defineProperty(_Object$assign, bender.project, bender.depVersions[bender.project]), _defineProperty(_Object$assign, "traceId", getMessagesUtk()), _Object$assign), data.query);
  return new Promise(function (resolve, reject) {
    method(url, Object.assign({}, data)).then(handleResolve(resolve)).catch(reject);
  });
}