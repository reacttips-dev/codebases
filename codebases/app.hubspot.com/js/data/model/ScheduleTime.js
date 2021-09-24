'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import I18n from 'I18n';
import { lpad } from '../../lib/utils';
import { FORMAT_TIME_FULL } from '../../lib/constants';
var DEFAULTS = {
  day: null,
  hour: null,
  minute: null
};
var FUZZY_MINUTES = 10;

var ScheduleTime = /*#__PURE__*/function (_Record) {
  _inherits(ScheduleTime, _Record);

  function ScheduleTime() {
    _classCallCheck(this, ScheduleTime);

    return _possibleConstructorReturn(this, _getPrototypeOf(ScheduleTime).apply(this, arguments));
  }

  _createClass(ScheduleTime, [{
    key: "getId",
    value: function getId() {
      return this.day + "-" + this.hour + "-" + this.minute;
    }
  }, {
    key: "getSortKey",
    value: function getSortKey() {
      return lpad(this.hour.toString(), '0', 2) + "-" + lpad(this.minute.toString(), '0', 2);
    }
  }, {
    key: "toTimeString",
    value: function toTimeString() {
      return I18n.moment().hour(this.hour).minute(this.minute).format(FORMAT_TIME_FULL);
    }
  }, {
    key: "toMinutes",
    value: function toMinutes() {
      return this.hour * 60 + this.minute;
    }
  }, {
    key: "toMoment",
    value: function toMoment() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : I18n.moment();
      return date.clone().startOf('day').hour(this.hour).minute(this.minute);
    }
  }, {
    key: "fuzzify",
    value: function fuzzify() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : I18n.moment();
      var m = this.toMoment(date);
      var fuzz = (m.valueOf() + m.date() + m.days()) % FUZZY_MINUTES + 1;
      return m.add(fuzz, 'minutes');
    }
  }]);

  return ScheduleTime;
}(Record(DEFAULTS));

export { ScheduleTime as default };