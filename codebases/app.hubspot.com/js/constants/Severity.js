'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

var Severity = /*#__PURE__*/function () {
  function Severity() {
    var _this = this;

    _classCallCheck(this, Severity);

    var severities = {
      CRITSIT: {
        id: 0,
        priority: 4
      },
      OUTAGE: {
        id: 1,
        priority: 3
      },
      MAINTENANCE: {
        id: 2,
        priority: 2
      },
      DEBUG: {
        id: 3,
        priority: 1
      }
    };
    this.idIndex = {};
    Object.keys(severities).forEach(function (key) {
      var value = severities[key];
      _this[key] = value;
      value.key = key;
      _this.idIndex[value.id] = value;
    });
  }

  _createClass(Severity, [{
    key: "getById",
    value: function getById(id) {
      return this.idIndex[id];
    }
  }, {
    key: "getByKey",
    value: function getByKey(key) {
      return this[key];
    }
  }]);

  return Severity;
}();

export default new Severity();