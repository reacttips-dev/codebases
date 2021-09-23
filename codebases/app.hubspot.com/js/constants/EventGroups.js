'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

var EventGroups = /*#__PURE__*/function () {
  function EventGroups() {
    var _this = this;

    _classCallCheck(this, EventGroups);

    this.eventGroups = {
      ON_LOAD: 'onLoad',
      ON_RECEIVE_ALARM: 'onReceiveAlarm',
      ON_RENDER_ALARM: 'onRenderAlarm',
      ON_RENDER_ALL: 'onRenderAll',
      ON_DISMISS_ALARM: 'onDismissAlarm',
      CREATE_ALARM: 'createAlarm'
    };
    this.keys().forEach(function (key) {
      var value = _this.eventGroups[key];
      _this[key] = value;
    });
  }

  _createClass(EventGroups, [{
    key: "keys",
    value: function keys() {
      return Object.keys(this.eventGroups);
    }
  }, {
    key: "getByKey",
    value: function getByKey(key) {
      return this[key];
    }
  }]);

  return EventGroups;
}();

export default new EventGroups();