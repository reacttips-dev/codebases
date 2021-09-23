'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Record, Set as ImmutableSet, fromJS } from 'immutable';
import PortalIdParser from 'PortalIdParser';
import ScheduleTime from './ScheduleTime';
var DEFAULTS = {
  suggestedScheduleGuid: null,
  fuzzy: null,
  portalId: null,
  suggestedTimes: List()
};

var Schedule = /*#__PURE__*/function (_Record) {
  _inherits(Schedule, _Record);

  function Schedule() {
    _classCallCheck(this, Schedule);

    return _possibleConstructorReturn(this, _getPrototypeOf(Schedule).apply(this, arguments));
  }

  _createClass(Schedule, [{
    key: "serialize",
    value: function serialize() {
      var json = this.toJS(); // backend will accept times with missing values, which could bug out the UI

      json.suggestedTimes = json.suggestedTimes.filter(function (t) {
        return t.day && typeof t.hour !== 'undefined' && typeof t.minute !== 'undefined';
      });
      return json;
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      attrs.portalId = PortalIdParser.get();
      attrs.suggestedTimes = ImmutableSet(attrs.suggestedTimes.map(function (t) {
        return new ScheduleTime(t);
      }));
      return new Schedule(fromJS(attrs));
    }
  }]);

  return Schedule;
}(Record(DEFAULTS));

export { Schedule as default };