'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Record } from 'immutable';
var DEFAULTS = {
  url: null,
  type: null,
  id: null,
  width: null,
  height: null
};

var ReportingPostMedia = /*#__PURE__*/function (_Record) {
  _inherits(ReportingPostMedia, _Record);

  function ReportingPostMedia() {
    _classCallCheck(this, ReportingPostMedia);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReportingPostMedia).apply(this, arguments));
  }

  _createClass(ReportingPostMedia, null, [{
    key: "createFromArray",
    value: function createFromArray(data) {
      return new List(data.map(function (attrs) {
        return new ReportingPostMedia(attrs);
      }));
    }
  }]);

  return ReportingPostMedia;
}(Record(DEFAULTS));

export { ReportingPostMedia as default };