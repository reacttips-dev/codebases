import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';

var FireAlarm = /*#__PURE__*/function (_Record) {
  _inherits(FireAlarm, _Record);

  function FireAlarm() {
    _classCallCheck(this, FireAlarm);

    return _possibleConstructorReturn(this, _getPrototypeOf(FireAlarm).apply(this, arguments));
  }

  _createClass(FireAlarm, [{
    key: "getDismissedLocalStorageKey",
    value: function getDismissedLocalStorageKey() {
      return "firealarm.dismiss.alarm." + this.id + ".revision." + this.revisionNumber;
    }
  }]);

  return FireAlarm;
}(Record({
  id: null,
  active: null,
  title: null,
  message: null,
  severity: null,
  revisionNumber: null,
  callToAction: null
}));

export { FireAlarm as default };