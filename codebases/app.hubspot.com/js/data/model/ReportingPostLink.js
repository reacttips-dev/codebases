'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Record } from 'immutable';
var DEFAULTS = {
  url: null,
  originalUrl: null,
  displayUrl: null
};

var ReportingPostLink = /*#__PURE__*/function (_Record) {
  _inherits(ReportingPostLink, _Record);

  function ReportingPostLink() {
    _classCallCheck(this, ReportingPostLink);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReportingPostLink).apply(this, arguments));
  }

  _createClass(ReportingPostLink, null, [{
    key: "createFromArray",
    value: function createFromArray(data) {
      return new List(data.map(function (attrs) {
        return new ReportingPostLink(attrs);
      }));
    }
  }]);

  return ReportingPostLink;
}(Record(DEFAULTS));

export { ReportingPostLink as default };