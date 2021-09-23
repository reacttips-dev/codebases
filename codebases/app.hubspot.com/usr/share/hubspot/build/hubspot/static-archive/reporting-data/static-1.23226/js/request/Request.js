'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Map as ImmutableMap, fromJS } from 'immutable';

var missing = function missing(object) {
  return function () {
    throw new Error("missing " + object);
  };
};

var RequestRecord = Record({
  method: 'GET',
  url: '',
  form: ImmutableMap(),
  query: ImmutableMap(),
  data: ImmutableMap(),
  timeout: 30000,
  transformer: missing('transformation')
}, 'Request');

var forMethod = function forMethod(method) {
  return function (data) {
    return new RequestRecord(fromJS(data).set('method', method));
  };
};

var Request = /*#__PURE__*/function (_RequestRecord) {
  _inherits(Request, _RequestRecord);

  function Request() {
    _classCallCheck(this, Request);

    return _possibleConstructorReturn(this, _getPrototypeOf(Request).apply(this, arguments));
  }

  _createClass(Request, null, [{
    key: "get",
    value: function get(data) {
      return forMethod('GET')(data);
    }
  }, {
    key: "post",
    value: function post(data) {
      return forMethod('POST')(data);
    }
  }, {
    key: "put",
    value: function put(data) {
      return forMethod('PUT')(data);
    }
  }, {
    key: "instance",
    value: function instance(data) {
      return new RequestRecord(fromJS(data));
    }
  }, {
    key: "sanitize",
    value: function sanitize(request) {
      return Request.instance(JSON.parse(JSON.stringify(request.delete('transformer'))));
    }
  }]);

  return Request;
}(RequestRecord);

export { Request as default };