'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { OrderedMap, Record, fromJS } from 'immutable';
var DEFAULTS = {
  guid: null,
  display_name: null,
  colorHex: null
};

var Campaign = /*#__PURE__*/function (_Record) {
  _inherits(Campaign, _Record);

  function Campaign() {
    _classCallCheck(this, Campaign);

    return _possibleConstructorReturn(this, _getPrototypeOf(Campaign).apply(this, arguments));
  }

  _createClass(Campaign, [{
    key: "getOption",
    value: function getOption() {
      return {
        value: this.guid,
        dropdownText: this.display_name,
        text: this.display_name
      };
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      return new Campaign(fromJS(attrs));
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(data) {
      return new OrderedMap(data.map(function (c) {
        return [c.guid, Campaign.createFrom(c)];
      })).sortBy(function (c) {
        return c.display_name;
      });
    }
  }]);

  return Campaign;
}(Record(DEFAULTS));

export { Campaign as default };