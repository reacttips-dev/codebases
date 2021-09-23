'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as http from '../../../request/http';
import toJS from '../../../lib/toJS';
import * as params from '../params';

var clean = function clean() {
  var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.keys(param).reduce(function (query, key) {
    return /^metadata-/i.test(key) ? query : Object.assign({}, query, _defineProperty({}, key, param[key]));
  }, {});
};

export var get = function get(spec, config) {
  var url = spec.url;
  var param = params.get(spec, config);
  return http.get(url + "/metadata", {
    query: clean(param)
  }).then(toJS).then(function (_ref) {
    var metadata = _ref.metadata;
    return metadata;
  });
};