'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Map as ImmutableMap, Record } from 'immutable';
var DEFAULTS = {
  byStatus: null,
  byChannel: null,
  likesByChannel: null,
  likesSeries: null
};

var BroadcastCounts = /*#__PURE__*/function (_Record) {
  _inherits(BroadcastCounts, _Record);

  function BroadcastCounts() {
    _classCallCheck(this, BroadcastCounts);

    return _possibleConstructorReturn(this, _getPrototypeOf(BroadcastCounts).apply(this, arguments));
  }

  _createClass(BroadcastCounts, [{
    key: "setByChannel",
    value: function setByChannel(currentData, previousData) {
      return this.set('byChannel', ImmutableMap(currentData).map(function (count, channelKey) {
        return ImmutableMap({
          count: count,
          previous: previousData[channelKey] || 0
        });
      }));
    }
  }, {
    key: "setLikesByChannel",
    value: function setLikesByChannel(currentData, previousData) {
      return this.set('likesByChannel', ImmutableMap(currentData).map(function (count, channelKey) {
        return ImmutableMap({
          count: count,
          previous: previousData[channelKey] || 0
        });
      }));
    }
  }]);

  return BroadcastCounts;
}(Record(DEFAULTS));

export { BroadcastCounts as default };